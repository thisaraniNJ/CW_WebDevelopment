// Function to load and display reviews
function loadReviews() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "userReviews.xml", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var xml = xhr.responseXML;
            var reviews = xml.getElementsByTagName("reviews");
            var container = document.getElementById("reviewsContainer");
            
            // Clear any previous content
            container.innerHTML = "";
            
            for (var i = 0; i < reviews.length; i++) {
                var username = reviews[i].getElementsByTagName("username")[0].textContent;
                var stars = reviews[i].getElementsByTagName("stars")[0].textContent;
                var comment = reviews[i].getElementsByTagName("comment")[0].textContent;
                var date = reviews[i].getElementsByTagName("date")[0].textContent;
                
                var reviewDiv = document.createElement("div");
                reviewDiv.className = "review";
                
                reviewDiv.innerHTML = `
                    <div class = "name">${username}</div>
                    <div class="stars">${stars}</div>
                    <div class = "comment">${comment}</div>
                    <div class = "date">${date}</div>
                `;
                
                container.appendChild(reviewDiv);
            }
        }
    };
    xhr.send();
}

window.onload = loadReviews;