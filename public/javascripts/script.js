$(".scrape-button").click(function(event) {
    $.ajax({
        method: "POST",
        url: "/scrape"
    })
        .done(function(data) {
            //log the response
            consoe.log(data);
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

  console.log("dataId: " + dataId)
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
  var modalSibling = articleParent.children('.modal.article-notes-modal');
  modalSibling.modal({detachable: false, observeChanges: true}).modal('show');

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