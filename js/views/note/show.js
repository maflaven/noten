NoteApp.Views.NoteShow = Backbone.View.extend({
  className: 'note-show',

  initialize: function (options) {

  },

  events: {
    'click #note': 'toggleShowNote',
    'click #delete': 'deleteNote',
    'click #edit': 'editNote',
    'click #save': 'saveNote',
    'click #close': 'closeNote'
  },

  render: function () {
    this.template = new EJS({text: window.show_ejs}).render();
    this.$el.html(this.template);

    this.initQuill();

    if (this.model.get('editing')) {this.editNote();}

    return this;
  },

  deleteNote: function (event) {
    var that = this;
    this.model.destroy({
      success: function () {
        that.closeNote();
      }
    });
  },

  initQuill: function () {
    if (!this.editor) {
      this.editor = new Quill('#editor', {
        modules: {
          'toolbar': { container: '#editor-toolbar' },
          'link-tooltip': true
        },
        formats: ['bold', 'bullet', 'list'],
        theme: 'snow'
      });
    }
    if (!this.reader) {
      this.reader = new Quill('#reader', {
        readOnly: true,
        theme: 'snow'
      });
    }
  },

  editNote: function (event) {
    this.model.get('content') && this.editor.setHTML(this.model.get('content'));
    this.toggleTools();
    // this.model.set('editing', false);
  },

  toggleTools: function () {
    [this.$('#editor'), this.$('#editor-toolbar'),
      this.$('#reader-toolbar'), this.$('#reader')].forEach( function (el) {
      el.toggleClass('hidden');
    });
    this.editor.focus();
  },

  saveNote: function (event) {
    var content = this.editor.getHTML();
    this.model.save({'content': content});
    var text = this.editor.getText();
    this.model.save({'text': text});
    if (content == "<div><br></div>") {this.deleteNote();}
    this.reader.setHTML(content);
    this.toggleTools();
    this.closeNote();
  },

  closeNote: function (event) {
    Backbone.history.navigate('', { trigger: true });
  }
});
