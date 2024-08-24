using Microsoft.AspNetCore.SignalR;

namespace SR.WebApi;

public class TimeService(IHubContext<ServerHub> templateHub, ILogger<TimeService> logger) : BackgroundService
{
    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var timer = new System.Timers.Timer(1000);
        timer.Enabled = true;
        timer.Elapsed += delegate
        {
            templateHub.Clients.All.SendAsync("setTime", DateTime.Now.ToString("dddd d MMMM yyyy HH:mm:ss"),
                cancellationToken: stoppingToken);
        };
        timer.Start();

        return Task.CompletedTask;
    }
}
