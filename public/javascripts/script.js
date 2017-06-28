$(".scrape-button").click(function(event) {
    $.ajax({
        method: "POST",
        url: "/scrape"
    })
        .done(function(data) {
            //log the response
            console.log(data);
        })

});

//Save article, one click to save an article.
$(".save-article").click(function (event) {

    event.stopPropagation();
    event.stopImmediatePropagation();

    var panel = $(this).closest(".panel");
    panel.hide();

    $.ajax({
            method: "POST",
            url: "/article",
            data: {
                title: panel.find('#artTitle').text(),
                post: panel.find('#artPost').text()
            }
        })
        // With that done
        .done(function (data) {
            // Log the response
            console.log(data);
        });
});
//show a modal to display how many articles is scraped.
$('#scrapeInfoModal').modal({detachable: false, observeChanges: true}).modal('show');

$('.delete-art').click(function(event) {
  event.stopPropagation();
  event.stopImmediatePropagation();

  var dataId = $(event.target).attr('data-id');

  console.log("dataId: " + dataId);
  $.ajax({
    method:"DELETE",
    url:("/article/" + dataId)
  })
    .done(function(data) {
      // $(event.target).closest('.saved').remove();
    });
  $(event.target).closest('.saved').remove();
});

$('.note-modal').click(function(event) {
  event.preventDefault();
  var articleParent = $(event.target).closest(".article");

  var articleId = $(event.target).closest(".article").attr("data-id");

  var modalSibling = articleParent.children('.modal.article-notes-modal');

  //Get the note context of the article.
  //clear any existing notes in the article note modal
  //TODO: put in new notes in the note modal.
  //pop up the new modal.

  var articleUrl = "/article/" + articleId;

  var single_note_source = $('#single-note-template').html();
  var single_note_template =  Handlebars.compile(single_note_source);

  $.ajax({
    method:"GET",
    url:articleUrl
  })
    .done(function(data) {
      var notes_container = $(event.target).closest('.article').find('.notes-container');
      notes_container.empty();
      _.each(data.note, function(single_note) {
        console.log(single_note.body);
        var note_html = single_note_template(single_note);
        notes_container.append(note_html);
      })

    });
  modalSibling.modal({detachable: false, observeChanges: true}).modal('show');
});

$('.save-note').click(function(event) {

  var noteContent = $(event.target).closest('.modal-content').children('textarea')[0];
  noteContent = "Example Note";
  var articleId = $(event.target).closest('.article').attr('data-id');

  console.log("To save note: "+ noteContent + " at article ID: " + articleId);
  var postUrl = "/article/" + articleId+ "/note";

  $.ajax({
    method:"POST",
    url:postUrl,
    data: {
      "Text": noteContent
    }
  })
    .done(function(data) {
      console.log(data);
    })

});

$('.delete-note').click(function(event) {
  var noteId = $(event.target).attr('data-id');
  console.log("to remove note id: " + noteId);
});
//
// $(document).on('click', '.note-modal', function (event) {
//     event.preventDefault();
//
//     var thisId = $(this).attr("data-id");
//
//     $('#art-id').text(thisId)
//
//     $('#note-form').attr("action", "/article/" + thisId + "?method=put");
//
//     $(".notes").empty();
//
//     $.ajax({
//             method: "GET",
//             url: "/article/" + thisId
//         })
//         // With that done, add the note information to the page
//         .done(function (data) {
//             console.log(data);
//             if (data.note.length === 0) {
//                 $(".notes").append('<div class="text-center note"><h4>No notes for article.</h4></div>')
//             } else {
//                 data.note.forEach(function (notes) {
//                     $(".notes").append('<div class="text-center note"><h4>' + notes.body + '</div>')
//                 });
//             }
//         });
// })