class News {
    api_key = "AAcg3bfQ5TnqiBr5JCdvnbU8OCx5uVnM"; 

    async getHeadlines() {
        const res = await fetch(`https://api.nytimes.com/svc/topstories/v2/world.json?api-key=${this.api_key}`);
        const data = await res.json();
        return data?.results || [];
    }
}

class TopStories {
    display(stories) {
        console.log(stories); 
        const main = document.querySelector('.main');
        const featuredStory = document.querySelector('.featured-story');
        const headlineContainer = document.querySelector('.headline-container');
        featuredStory.innerHTML = '';
        headlineContainer.innerHTML = '';

        if (stories.length > 0) {
            const firstStory = stories[0];

            if (firstStory.multimedia?.[0]?.url) {
                const featuredImage = document.createElement('img');
                featuredImage.src = firstStory.multimedia[0].url;
                featuredStory.appendChild(featuredImage);
            }

            const featuredTitle = document.createElement('h2');
            featuredTitle.textContent = firstStory.title;
            featuredStory.appendChild(featuredTitle);

            featuredStory.addEventListener('click', () => {
                window.open(firstStory.url, '_blank');
            });

            stories.slice(1).forEach(story => {
                const headline = document.createElement('div');
                headline.classList.add('headline');

                if (story.multimedia?.[0]?.url) {
                    const image = document.createElement('img');
                    image.src = story.multimedia[0].url;
                    headline.appendChild(image);
                }

                const title = document.createElement('h2');
                title.textContent = story.title;
                headline.appendChild(title);

                headline.addEventListener('click', () => {
                    window.open(story.url, '_blank');
                });

                headlineContainer.appendChild(headline);
            });
        }
    }
}

const nytimes = new News();  
const topStories = new TopStories();  
let allHeadlines = [];

(async () => {
    allHeadlines = await nytimes.getHeadlines();  
    topStories.display(allHeadlines);  
})();

function search() {
    const input = document.getElementById('searchbar').value.toLowerCase();
    const suggestions = document.getElementById('suggestions');

    suggestions.innerHTML = '';
    suggestions.style.display = input.length > 0 ? 'block' : 'none'; 

    const filteredHeadlines = allHeadlines.filter(story => 
        story.title.toLowerCase().includes(input)
    );

    if (filteredHeadlines.length > 0) {
        // Display filtered headlines
        topStories.display(filteredHeadlines);

        // Show suggestions
        const uniqueTitles = [...new Set(filteredHeadlines.map(story => story.title))];
        uniqueTitles.slice(0, 5).forEach(title => {
            const suggestionItem = document.createElement('li');
            suggestionItem.textContent = title;
            suggestionItem.onclick = () => {
                document.getElementById('searchbar').value = title;
                suggestions.style.display = 'none';
                performSearch(title); 
            };
            suggestions.appendChild(suggestionItem);
        });
    } else {
        const noResultItem = document.createElement('li');
        noResultItem.textContent = 'No result found';
        noResultItem.classList.add('no-result');
        suggestions.appendChild(noResultItem);
    }
}

async function performSearch(selectedKeyword) {
    const main = document.querySelector('.main');
    const suggestions = document.getElementById('suggestions');

    const storiesByKeyword = allHeadlines.filter(story => 
        story.title.toLowerCase().includes(selectedKeyword)
    );

    suggestions.innerHTML = '';

    if (storiesByKeyword.length > 0) {
        main.style.display = 'block';
        topStories.display(storiesByKeyword);
    } else {
        const noResultMessage = document.createElement('div');
        noResultMessage.textContent = 'No result found';
        noResultMessage.classList.add('no-result');
        main.innerHTML = '';
        main.appendChild(noResultMessage);
    }
}
