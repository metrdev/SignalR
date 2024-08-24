using Microsoft.AspNetCore.SignalR;

namespace SR.WebApi;

public class ServerHub(ILogger<ServerHub> logger) : Hub
{
    public override async Task OnConnectedAsync()
    {
        var connectionId = Context.ConnectionId;
        logger.LogInformation("{ConnectionId} connected", connectionId);
        // TODO get user
        const string user = "ReceiverId";
        await Groups.AddToGroupAsync(connectionId, user);
        await base.OnConnectedAsync();
    }
    
    public override Task OnDisconnectedAsync(Exception? exception)
    {
        Console.WriteLine("A client disconnected: " + Context.ConnectionId);
        return base.OnDisconnectedAsync(exception);
    }
    
    public async Task SendConnectionId(string connectionId)
    {
        await Clients.All.SendAsync("setClientMessage", "A connection with ID '" + connectionId + "' has just connected");
    }
}
