using Microsoft.AspNetCore.SignalR;

namespace SR.WebApi;

public class Broadcaster(IHubContext<ServerHub> hubContext) : IBroadcaster
{
    public async Task Send(string method, BroadcastMessageSiteDto message)
    {
        await hubContext.Clients
            // TODO
            // .Group(message.ReceiverId.ToString())
            // .Group("ReceiverId")
            .All
            .SendAsync(method, message);
    }
}
