NoteApp.Collections.Notes = Backbone.Collection.extend({
  localStorage: new Backbone.LocalStorage("Notes"),
  model: NoteApp.Models.Note,
  comparator: "ord"
});
