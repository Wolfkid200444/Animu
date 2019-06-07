module.exports = client => {
  client.on('message', async msg => {
    const aldovia = client.guilds.get('556442896719544320');

    //Channel Specific Management
    const generalMemesChannel = aldovia.channels.get('586086952948727818');
    const animeMemesChannel = aldovia.channels.get('586087119295086603');

    if (
      (msg.channel.id === generalMemesChannel.id ||
        msg.channel.id === animeMemesChannel.id) &&
      msg.attachments.size < 1
    )
      msg.delete(2000);
  });
***REMOVED***
