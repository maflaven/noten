NoteApp.Routers.Router = Backbone.Router.extend({
  initialize: function (options) {
    this.$rootEl = options.$rootEl;
    this.notes = new NoteApp.Collections.Notes();
    this.notes.fetch();
  },

  routes: {
    '': 'noteIndex',
    'notes/:id': 'noteShow'
  },

  noteIndex: function () {
    var view = new NoteApp.Views.NoteIndex({
      collection: this.notes
    });
    this._swapView(view);
  },

  noteShow: function (cid) {
    var note = this.notes.get(cid);
    if (!note) {Backbone.history.navigate('', { trigger: true }); return;}
    var view = new NoteApp.Views.NoteShow({
      model: note
    });
    this._swapView(view);
  },

  _swapView: function (view) {
    this._currentView && this._currentView.remove();
    this._currentView = view;

    this.$rootEl.html(view.$el);
    view.$el.hide();
    view.$el.fadeIn("fast");
    view.render();
  }
});
