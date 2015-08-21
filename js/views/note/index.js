NoteApp.Views.NoteIndex = Backbone.CompositeView.extend({
  className: 'landing',

  initialize: function (options) {
    this.collection.each(this.addNoteView.bind(this));
    this.listenTo(this.collection, "add", this.addNoteView);
    this.listenTo(this.collection, "remove", this.removeNoteView);
  },

  events: {
    'click #new': 'addNewNote',
    'click #download-all': 'downloadAllNotes'
  },

  render: function () {
    this.template = new EJS({text: window.index_ejs}).render();
    this.$el.html(this.template);
    this.attachSubviews();
    this.displayDownloadButton();
    this.makeSortableIndex();
    return this;
  },

  makeSortableIndex: function () {
    this.$('#note-index').sortable({
      handle: ".handle",
      stop: this.updateOrder.bind(this)
    });
  },

  displayDownloadButton: function () {
    var $btn = this.$('#download-all');
    $btn.prop("disabled", true);
    if (this.collection.length > 0) {
      $btn.removeClass("hidden");
    } else {
      $btn.fadeOut(100, function () {
        $btn.addClass("hidden");
      });
    }
    $btn.prop("disabled", false);
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
    this.displayDownloadButton();
    this.removeModelSubview('#note-index', note);
  },

  updateOrder: function () {
    var notes = this.$('.note-index-item');
    var that = this;
    notes.each( function (i, note) {
      var noteCid = $(note).attr('data-cid')
      var note = that.collection.get(noteCid);
      note.save({'ord': i});
    });
  },

  downloadAllNotes: function () {
    var zip = new JSZip();
    this.collection.each(function (note) {
      zip.file(note.get("ord") + ".txt", note.get("text"));
    });
    var zipAsBlob = zip.generate({
      type: 'blob'
    });
    saveAs(zipAsBlob, "noten.zip");
  }
});
