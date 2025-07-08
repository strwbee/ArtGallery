document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("viewCollection").addEventListener("click", loadCollection);
})

//load title screen: no get requests involved here
function loadTitle() {
    const title = document.querySelector(".title");
    title.style.display = "flex";

    const content = document.querySelector(".content");
    content.style.display = "none";
}

//get artworks from server
function loadCollection(retries = 0) {
    //clear title screen
    const title = document.querySelector(".title");
    title.style.display = "none";

    //make collection content visible
    const contentDiv = document.getElementById("content");
    contentDiv.style.display = "grid"; 

    contentDiv.innerHTML = `
        <button id="return" class="return">return</button>
        <div class="paintingsGrid"></div>
    `;

    document.getElementById("return").addEventListener("click", loadTitle);

    //fetch/get the paintings
    fetch("/api/paintings")
    .then((resp) => resp.json())
    .then((paintings) => {
        const paintingsGrid = document.querySelector(".paintingsGrid")
        paintingsGrid.innerHTML = ""

        //loop through paintings and display
        paintings.forEach((painting) => {
            const paintingDiv = document.createElement("div");
            paintingDiv.className = "painting";

            paintingDiv.innerHTML = `
                <img src="${painting.imageURL}" alt="${painting.title}">
                <h3 class="paintingTitle" paintingId="${painting.id}">${painting.title}</h3>
                <p>${painting.artist}</p>
            `;
            //add painting to grid
            paintingsGrid.appendChild(paintingDiv);
        });

        document.querySelector(".paintingsGrid").addEventListener("click", loadPainting);
    })
    .catch((error) => {
      console.error("collection load error :( :", error);
      serverError(retries, loadCollection);
    });
}

// handle if server disconnects/error
function serverError(retries, func) {
    const errorMessage = document.getElementById("errorMessage");
    errorMessage.style.display = "block";

    // try again every 5 seconds
    setTimeout(() => {
        func(retries + 1)
            .then(() => { errorMessage.style.display = "none"; })
            .catch(() => {});
    }, 5000);
}

//get painting by id (id chosen from click)
function loadPainting(e) {
    //check it was a title that was clicked on
    if (!e.target.classList.contains("paintingTitle")) {
        return;
    }

    //retrieve the ID to send in GET method
    const paintingId = e.target.getAttribute("paintingId");

    fetch(`/api/painting/${paintingId}`)
    .then ((resp) => resp.json())
    .then((painting) => {
        const contentDiv = document.getElementById("content");

        contentDiv.innerHTML = `
            <button id="return2" class="return">return</button>
            <div class="paintingDiv">
                <div class="paintingInfo">
                    <img src="${painting.imageURL}" alt="${painting.title}">
                    <div class="paintingBigInfo">
                        <h2>${painting.title}</h2>
                        <h3>${painting.artist}</h3>
                    </div>
                    <p><span class="label">Artist Info: </span><span class="value">${painting.artistInfo}</span></p>
                    <p><span class="label">Year Created: </span><span class="value">${painting.year}</span></p>
                    <p><span class="label">Medium: </span><span class="value">${painting.medium}</span></p>
                    <p><span class="label">Dimensions: </span><span class="value">${painting.dimensions}</span></p>
                </div>
                <div class="commentsDiv">
                    <h3>comments:</h3>
                    <div id="commentBox" class="commentBox"></div>
                    <input type="text" id="commentorName" class="commentorName" placeholder="Your name...">
                    <textarea id="input" class="input" placeholder="Add a comment..."></textarea>
                    <button id="commentButton" class="commentButton">submit</button>
                </div>
            </div>
        `;

        document.getElementById("return2").addEventListener("click", loadCollection);
        document.getElementById("commentButton").addEventListener("click", () => submitComment(paintingId));

        loadComments(paintingId);
    })
    .catch((error) => {
        console.error("collection load error :( :", error);
        serverError(0, () => loadPainting(e));
    });
}

//get comments from server
function loadComments(paintingId, retries = 0) {
    fetch(`/api/comments/${paintingId}`)
    .then(resp => resp.json())
    .then(comments => {
        const commentBox = document.getElementById("commentBox");
        commentBox.innerHTML = "";

        if (comments.length === 0) {
            commentBox.innerHTML = `<p class="noCommentsMsg">No comments yet...</p>`;
            return;
        }

        //loop through each comment to display it dynamically
        comments.forEach(function(comment) {
            const singleCommentBox = document.createElement("div");
            singleCommentBox.classList.add("comment");

            const name = document.createElement("p");
            name.classList.add("nameText");
            name.textContent = comment.name + ":";

            const text = document.createElement("p");
            text.classList.add("commentText");
            text.textContent = comment.text;

            singleCommentBox.appendChild(name);
            singleCommentBox.appendChild(text);
            commentBox.appendChild(singleCommentBox);
        })
    })
    .catch((error) => {
        console.error("comments load error :( :", error);
        serverError(retries, () => loadComments(paintingId, retries + 1));
    });
}

//post comment to server
function submitComment(paintingId) {
    const nameText = document.getElementById("commentorName").value.trim();
    const commentText = document.getElementById("input").value.trim();
    //dont allow empty comments
    if (!commentText) {
        alert("Type your comment first plz");
        return;
    }

    const newComment = {
        paintingId: paintingId,
        name: nameText || "Anonymous",
        text: commentText
    };

    fetch(`/api/comments/${paintingId}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(newComment)
    })
    .then(resp => resp.json())
    .then(() => {
        //clear
        document.getElementById("input").value = "";
        document.getElementById("commentorName").value = "";
        loadComments(paintingId);
    })
    .catch((error) => {
        console.error("error submitting comment :( :", error);
        alert("error submitting comment :(");
    });
}