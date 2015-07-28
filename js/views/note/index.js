NoteApp.Views.NoteIndex = Backbone.CompositeView.extend({
  className: 'landing',

  initialize: function (options) {
    this.collection.each(this.addNoteView.bind(this));
    this.listenTo(this.collection, "add", this.addNoteView);
    this.listenTo(this.collection, "remove", this.removeNoteView);
  },

  events: {
    'click #new': 'addNewNote'
  },

  render: function () {
    this.template = new EJS({text: window.index_ejs}).render();
    this.$el.html(this.template);
    this.attachSubviews();
    this.makeSortableIndex();
    return this;
  },

  makeSortableIndex: function () {
    this.$('#note-index').sortable({
      handle: ".handle",
      stop: this.updateOrder.bind(this)
    });
  },

  addNewNote: function (event) {
    var note = new NoteApp.Models.Note({
      'editing': true,
      'ord': -1
    });
    this.collection.add(note);
    Backbone.history.navigate('/notes/' + note.cid, { trigger: true });
  },

  addNoteView: function (note) {
    var subview = new NoteApp.Views.NoteIndexItem({
      model: note,
    });
    this.addSubview('#note-index', subview);
  },

  removeNoteView: function (note) {
    this.removeModelSubview('#note-index', note);
  },

  updateOrder: function () {
    window.notes = this.$('.note-index-item');
    var that = this;
    notes.each( function (i, note) {
      var noteCid = $(note).attr('data-cid')
      var note = that.collection.get(noteCid);
      note.save({'ord': i});
    })
  }
});
