using System.Net;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;

namespace EfbBridge;

public static class Program
{
    public static async Task Main(string[] args)
    {
        var config = BridgeConfig.FromArgs(args);
        var dataSource = SimDataSourceFactory.Create(config.Mode);

        Console.WriteLine($"EFB MSFS bridge starting in '{config.Mode}' mode");
        Console.WriteLine($"Listening on ws://{config.Host}:{config.Port}/");

        var server = new TelemetryWebSocketServer(config, dataSource);
        await server.StartAsync();
    }
}

public sealed class BridgeConfig
{
    public string Host { get; init; } = "0.0.0.0";
    public int Port { get; init; } = 4001;
    public string Mode { get; init; } = "mock";

    public static BridgeConfig FromArgs(string[] args)
    {
        var config = new BridgeConfig();

        for (var i = 0; i < args.Length; i++)
        {
            switch (args[i])
            {
                case "--host":
                    if (i + 1 < args.Length) config = config with { Host = args[++i] };
                    break;
                case "--port":
                    if (i + 1 < args.Length && int.TryParse(args[++i], out var port))
                    {
                        config = config with { Port = port };
                    }
                    break;
                case "--mode":
                    if (i + 1 < args.Length) config = config with { Mode = args[++i].ToLowerInvariant() };
                    break;
            }
        }

        return config;
    }

    public BridgeConfig with { get; init; }
}

public interface ISimDataSource
{
    FlightState GetTelemetry();
}

public sealed class SimDataSourceFactory
{
    public static ISimDataSource Create(string mode)
    {
        return mode switch
        {
            "simconnect" => new SimConnectDataSource(),
            _ => new MockSimDataSource()
        };
    }
}

public sealed class MockSimDataSource : ISimDataSource
{
    private double _phase = 0;

    public FlightState GetTelemetry()
    {
        _phase += 0.15;

        return new FlightState
        {
            Timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
            Aircraft = new AircraftState
            {
                Type = "Cessna 172",
                Callsign = "N123AB",
                Registration = "N123AB"
            },
            Position = new PositionState
            {
                Latitude = 51.4700 + Math.Sin(_phase) * 0.00025,
                Longitude = -0.4543 + Math.Cos(_phase * 0.8) * 0.00035,
                Altitude = 2400 + Math.Sin(_phase * 1.7) * 12,
                Heading = (145 + (_phase * 9.5)) % 360,
                Pitch = 2.1,
                Roll = -0.8
            },
            Airdata = new AirdataState
            {
                IndicatedAirspeed = 125 + Math.Sin(_phase * 1.4) * 5,
                TrueAirspeed = 132 + Math.Sin(_phase * 1.2) * 4,
                GroundSpeed = 128 + Math.Cos(_phase * 1.1) * 7,
                VerticalSpeed = 220 + Math.Sin(_phase * 2.1) * 30,
                PressureAltitude = 2450 + Math.Sin(_phase) * 10
            },
            Engine = new EngineState
            {
                Rpm = 2200 + Math.Sin(_phase * 2.3) * 90,
                FuelFlow = 19.5 + Math.Cos(_phase * 1.8) * 0.8,
                FuelRemaining = 120 - (_phase % 20) * 0.2,
                OilTemp = 86 + Math.Sin(_phase * 1.5) * 2
            },
            Nav = new NavState
            {
                ActiveWaypoint = "EGLL",
                NextWaypoint = "MCT",
                DistanceRemaining = 14.8,
                Bearing = 182
            },
            Environment = new EnvironmentState
            {
                WindDirection = 210,
                WindSpeed = 17,
                Temperature = 12,
                Pressure = 1013
            },
            Systems = new SystemsState
            {
                Flaps = 10,
                Gear = false,
                Autopilot = true
            }
        };
    }
}

public sealed class SimConnectDataSource : ISimDataSource
{
    public FlightState GetTelemetry()
    {
        // This is the integration hook for a future real SimConnect connection.
        // In the actual MSFS implementation, this method would request the telemetry fields
        // from SimConnect and populate the FlightState object accordingly.
        return new MockSimDataSource().GetTelemetry();
    }
}

public sealed class TelemetryWebSocketServer
{
    private readonly BridgeConfig _config;
    private readonly ISimDataSource _dataSource;
    private readonly HttpListener _listener = new();

    public TelemetryWebSocketServer(BridgeConfig config, ISimDataSource dataSource)
    {
        _config = config;
        _dataSource = dataSource;
    }

    public async Task StartAsync()
    {
        var prefix = $"http://{_config.Host}:{_config.Port}/";
        _listener.Prefixes.Add(prefix);
        _listener.Start();

        try
        {
            while (true)
            {
                var context = await _listener.GetContextAsync();
                if (!context.Request.IsWebSocketRequest)
                {
                    context.Response.StatusCode = 400;
                    context.Response.Close();
                    continue;
                }

                var wsContext = await context.AcceptWebSocketAsync(null);
                _ = Task.Run(() => HandleSocketAsync(wsContext.WebSocket));
            }
        }
        finally
        {
            _listener.Stop();
        }
    }

    private async Task HandleSocketAsync(WebSocket socket)
    {
        Console.WriteLine("Client connected");

        try
        {
            while (socket.State == WebSocketState.Open)
            {
                var telemetry = _dataSource.GetTelemetry();
                var json = JsonSerializer.Serialize(telemetry);
                var buffer = Encoding.UTF8.GetBytes(json);
                await socket.SendAsync(new ArraySegment<byte>(buffer), WebSocketMessageType.Text, true, CancellationToken.None);
                await Task.Delay(1000);
            }
        }
        catch (WebSocketException ex)
        {
            Console.WriteLine($"WebSocket exception: {ex.Message}");
        }
        finally
        {
            Console.WriteLine("Client disconnected");
            socket.Dispose();
        }
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
