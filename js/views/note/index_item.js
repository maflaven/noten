NoteApp.Views.NoteIndexItem = Backbone.View.extend({
  tagName: 'li',
  className: 'col-xs-6 col-sm-4 col-md-3 note-index-item',

  initialize: function (options) {

  },

  events: {
    'click .edit': 'showNote',
    'click .delete': 'deleteNote'
  },

  render: function () {
    this.template = new EJS({text: window.index_item_ejs}).render(this.model);
    this.$el.html(this.template);
    this.$el.attr('data-cid', this.model.cid);
    return this;
  },

  showNote: function (event) {
    Backbone.history.navigate('/notes/' + this.model.cid, { trigger: true });
  },

  deleteNote: function (event) {
    var that = this;
    this.$el.fadeOut("fast", function () {
      that.model.destroy();
    });
  }
});
