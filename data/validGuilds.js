const ValidGuilds = (***REMOVED***
  list: [],
  add: function(id) {
    ValidGuilds.list.push(id);
  },
  remove: function(id) {
    ValidGuilds.list = ValidGuilds.list.filter((guildID) => guildID === id);
  },
  has: function(id) {
    return ValidGuilds.list.find((guildID) => guildID === id) === undefined
      ? false
      : true;
  },
});
