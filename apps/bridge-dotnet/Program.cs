using System.Net;
using System.Net.Sockets;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;

namespace EfbBridge;

public static class Program
{
    public static async Task Main(string[] args)
    {
        Console.WriteLine("EFB MSFS Bridge starting...");
        Console.WriteLine("This Windows-side bridge is designed to read telemetry from MSFS and stream it to the iPad over WiFi.");

        var server = new LocalTelemetryServer();
        await server.StartAsync();
    }
}

public sealed class LocalTelemetryServer
{
    private readonly HttpListener _listener = new();
    private readonly CancellationTokenSource _cts = new();
    private readonly SimConnectBridge _simBridge = new();

    public async Task StartAsync()
    {
        // Example local endpoint: ws://192.168.1.20:4001
        var prefix = "http://0.0.0.0:4001/";
        _listener.Prefixes.Add(prefix);
        _listener.Start();

        Console.WriteLine($"Listening on {prefix}");

        _simBridge.Start();

        try
        {
            while (!_cts.IsCancellationRequested)
            {
                var context = await _listener.GetContextAsync();
                if (context.Request.IsWebSocketRequest)
                {
                    var wsContext = await context.AcceptWebSocketAsync(null);
                    _ = Task.Run(async () => await HandleSocketAsync(wsContext.WebSocket));
                }
                else
                {
                    context.Response.StatusCode = 400;
                    context.Response.Close();
                }
            }
        }
        catch (HttpListenerException ex)
        {
            Console.WriteLine($"Listener error: {ex.Message}");
        }
        finally
        {
            _listener.Stop();
            _cts.Cancel();
        }
    }

    private async Task HandleSocketAsync(WebSocket socket)
    {
        Console.WriteLine("Client connected");

        try
        {
            while (socket.State == WebSocketState.Open)
            {
                var telemetry = _simBridge.GetLatestTelemetry();
                var json = JsonSerializer.Serialize(telemetry);
                var payload = Encoding.UTF8.GetBytes(json);
                await socket.SendAsync(new ArraySegment<byte>(payload), WebSocketMessageType.Text, true, CancellationToken.None);
                await Task.Delay(1000);
            }
        }
        catch (WebSocketException ex)
        {
            Console.WriteLine($"Socket error: {ex.Message}");
        }
        finally
        {
            Console.WriteLine("Client disconnected");
            socket.Dispose();
        }
    }
}

public sealed class SimConnectBridge
{
    private FlightState _latest = new()
    {
        Timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
        Aircraft = new AircraftState { Type = "Cessna 172", Callsign = "N123AB", Registration = "N123AB" },
        Position = new PositionState { Latitude = 51.47, Longitude = -0.4543, Altitude = 2400, Heading = 145, Pitch = 2.1, Roll = -0.8 },
        Airdata = new AirdataState { IndicatedAirspeed = 125, TrueAirspeed = 132, GroundSpeed = 128, VerticalSpeed = 230, PressureAltitude = 2450 },
        Engine = new EngineState { Rpm = 2200, FuelFlow = 19.5, FuelRemaining = 120, OilTemp = 86 },
        Nav = new NavState { ActiveWaypoint = "EGLL", NextWaypoint = "MCT", DistanceRemaining = 14.8, Bearing = 182 },
        Environment = new EnvironmentState { WindDirection = 210, WindSpeed = 17, Temperature = 12, Pressure = 1013 },
        Systems = new SystemsState { Flaps = 10, Gear = false, Autopilot = true }
    };

    public void Start()
    {
        // This is the Windows-side integration point for Microsoft Flight Simulator.
        // In the real implementation, you would connect to SimConnect here and read live data.
        // For now, this starter emits a realistic mock stream so the app can be tested end-to-end.
        Console.WriteLine("SimConnect bridge initialized. Waiting for simulator connection.");
    }

    public FlightState GetLatestTelemetry()
    {
        var phase = (DateTimeOffset.UtcNow.ToUnixTimeMilliseconds() / 1000.0);

        _latest.Timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        _latest.Position.Altitude = 2400 + Math.Sin(phase) * 8;
        _latest.Position.Heading = (145 + (phase * 3.5)) % 360;
        _latest.Airdata.IndicatedAirspeed = 125 + Math.Sin(phase * 1.4) * 6;
        _latest.Engine.FuelRemaining = 120 - (phase % 20) * 0.15;

        return _latest;
    }
}

public sealed class FlightState
{
    public long Timestamp { get; set; }
    public AircraftState Aircraft { get; set; } = new();
    public PositionState Position { get; set; } = new();
    public AirdataState Airdata { get; set; } = new();
    public EngineState Engine { get; set; } = new();
    public NavState Nav { get; set; } = new();
    public EnvironmentState Environment { get; set; } = new();
    public SystemsState Systems { get; set; } = new();
}

public sealed class AircraftState
{
    public string Type { get; set; } = string.Empty;
    public string Callsign { get; set; } = string.Empty;
    public string Registration { get; set; } = string.Empty;
}

public sealed class PositionState
{
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public double Altitude { get; set; }
    public double Heading { get; set; }
    public double Pitch { get; set; }
    public double Roll { get; set; }
}

public sealed class AirdataState
{
    public double IndicatedAirspeed { get; set; }
    public double TrueAirspeed { get; set; }
    public double GroundSpeed { get; set; }
    public double VerticalSpeed { get; set; }
    public double PressureAltitude { get; set; }
}

public sealed class EngineState
{
    public double Rpm { get; set; }
    public double FuelFlow { get; set; }
    public double FuelRemaining { get; set; }
    public double OilTemp { get; set; }
}

public sealed class NavState
{
    public string ActiveWaypoint { get; set; } = string.Empty;
    public string NextWaypoint { get; set; } = string.Empty;
    public double DistanceRemaining { get; set; }
    public double Bearing { get; set; }
}

public sealed class EnvironmentState
{
    public double WindDirection { get; set; }
    public double WindSpeed { get; set; }
    public double Temperature { get; set; }
    public double Pressure { get; set; }
}

public sealed class SystemsState
{
    public double Flaps { get; set; }
    public bool Gear { get; set; }
    public bool Autopilot { get; set; }
}
