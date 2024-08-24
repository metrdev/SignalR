namespace SR.WebApi;

public class WebApp
{
    public void Run(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddSignalR();
        builder.Services.AddTransient<IBroadcaster, Broadcaster>();

        builder.Services.AddHttpLogging(_ => { });

        builder.Services.AddHostedService<TimeService>();

        var app = builder.Build();

        app.UseHttpLogging();

        app.MapGet("/ping", () => "Ok");

        app.UseDefaultFiles();
        app.UseStaticFiles(new StaticFileOptions());

        app.MapHub<ServerHub>("/serverHub");

        app.Run();
    }
}
