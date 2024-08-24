namespace SR.WebApi;

public interface IBroadcaster
{
    Task Send(string method, BroadcastMessageSiteDto message);
}
