if (document.readyState === "complete") {
    postikiisu();
} else {
    document.addEventListener('DOMContentLoaded', postikiisu(), false);
}

function postikiisu() {
    const CAT_API = "//thecatapi.com/api/images/get?format=src";

    // Process images that are immediately visible on page load
    let links = document.querySelectorAll(".article--in-list__image, .article-list__image");
    for (let i = 0; i < links.length; i++) {
        updateNodeStyle(links[i], CAT_API);

        // There might be in-flight requests by the PMO script that will change the backgroundImage based on the old
        // data-src-* attributes
        let observer = new MutationObserver(function (mutations, observer) {
            observer.disconnect();
            mutations.forEach(function (mutation) {
                if (mutation.target.style.backgroundImage.indexOf(CAT_API) == -1) {
                    mutation.target.style.backgroundImage = "url('" + CAT_API + "&rand=" + Math.random() + "')";
                }
            });
        });
        let config = {attributes: true, attributeFilter: ['style']};
        observer.observe(links[i], config);
    }

    // Catch images that are added to the DOM
    let observer = new MutationObserver(function (mutations, observer) {
        mutations.forEach(function (mutation) {
            let images = mutation.target.querySelectorAll(".article-list__image");
            for (let i = 0; i < images.length; i++) {
                updateNodeStyle(images[i], CAT_API);
            }
        });
    });
    let config = {subtree: true, childList: true};
    observer.observe(document.body, config);


    // Update article hero images
    let heros = document.getElementsByClassName("article-media-figure--show-fullscreen");
    for (let i = 0; i < heros.length; i++) {
        heros[i].src = CAT_API + "&rand=" + Math.random();
    }

    let authorDiv = document.getElementsByClassName("article-author__image");
    for (let i = 0; i < authorDiv.length; i++) {
        authorDiv[i].children[0].src = "https://placebear.com/65/65";
    }
}

function updateNodeStyle(node, CAT_API) {
    let random = Math.random();
    node.setAttribute("data-src-small", CAT_API + "&size=small&asd=" + random);
    node.setAttribute("data-src-medium", CAT_API + "&size=med&asd=" + random);
    node.setAttribute("data-src-large", CAT_API + "&size=full&asd=" + random);
    if (node.style.backgroundImage.indexOf(CAT_API) == -1) {
        node.style.backgroundImage = "url('" + CAT_API + "&rand=" + random + "')";
    }
}
