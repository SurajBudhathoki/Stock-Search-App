//creating an array of stocks to display
const stocksList = ['GOOG','AAPL','AMZN','TSLA','FB'];

//a function to display the required content
const displayInfo =  function(){

    const stock = $(this).attr('data-name');
    const queryURL = `https://api.iextrading.com/1.0/stock/${stock}/batch?types=quote,news,logo&range=1m&last=10`;

    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function(response){

        //storing required information from the api to a variable
        const companyName = response.quote.companyName;
        const stockSymbol = response.quote.symbol;
        const stockPrice = response.quote.latestPrice;
        
        const logo = response.logo.url;
    
      
        //creating a divBody to hold the information
        const divBody = $('<div>');
        divBody.addClass('card');
        const divContent = $('<div>');
        divContent.addClass('card-body');

        const logoHolder = $(`<img src = "${logo}">`);
        const nameHolder = $('<p>').text(`Company Name: ${companyName}`);
        const symbolHolder = $('<p>').text(`Stock Symbol: ${stockSymbol}`);
        const priceHolder = $('<p>').text(`Stock Price: $${stockPrice}`);
        const additional = $(`<button id ='addinfo'> Details... </button> <br>`)
    
        // Appending the information to our info div in the html
       
        $('#info').append(`<h5 class="card-header">Company Information</h5>`);
          
        divContent.append(logoHolder, nameHolder, symbolHolder, priceHolder, additional );
        divBody.append(divContent);
        $('#info').append(divBody);

        const newsBody = $('<div>');
        newsBody.addClass('card');
        const newsContent = $('<div>');
        newsContent.addClass('card-body');

        const companyNews = response.news;

        //looping through the news array to grab the headlines
        for(let i = 0; i < companyNews.length; i++) {
         
            const headline = response.news[i].headline;
            const url = response.news[i].url;
            newsContent.append(`<p> <a href = "${url}" target="_blank"> ${headline} </a> </p>`);
          
        }
       

        

        $('#news').append(`<h5 class="card-header">Top News</h5>`);
        newsBody.append(newsContent);
        $('#news').append(newsBody);

        const additionalInfo = function(){

          
        
            const queryURL = `https://api.iextrading.com/1.0/stock/${stock}/company`;
        
            $.ajax({
                url: queryURL,
                method: 'GET'
            }).then(function(response){
        
                const CEO = response.CEO;
                const desc = response.description;
                const industry = response.industry;
                const tags = response.tags;
                const website = response.website;
        
        
                const ceoHolder = $('<p>').text(`CEO: ${CEO}`);
                const descHolder = $('<p>').text(`Description: ${desc}`);
                const industryHolder = $('<p>').text(`Industry: ${industry}`);
                const tagsHolder = $('<p>').text(`Tags: ${tags}`);
                const websiteHolder = $('<p>').html(`Website: <a href = "${website}" target="_blank" >${website} </a>`);

                divContent.append(ceoHolder, descHolder, industryHolder, tagsHolder, websiteHolder);
            })
        
        }

        $('#addinfo').on('click', additionalInfo);
        
        
    });

    $('#addinfo').empty();
    $('#info').empty();
    $('#news').empty();
};


const render = function () {

    // Deleting the stocks prior to adding new stocks
    $('#buttons').empty();
  
 
    for (let i = 0; i < stocksList.length; i++) {
  
    const button = $('<button>');
      
    // Adding a class of stock-btn to our button
    button.addClass('btn btn-outline-secondary stk');
      
    // Adding a data-attribute
    button.attr('data-name', stocksList[i]);
      
    button.text(stocksList[i]);
    
    $('#buttons').append(button);
    }
}



const addButton = function(event) {

    event.preventDefault();
    
    const validationList = [];
    const URL =  `https://api.iextrading.com/1.0/ref-data/symbols`;

    $.ajax({
    url: URL,
    method: 'GET'
    }).then(function(response){

        for(let i = 0; i < response.length; i++){

        validationList.push(response[i].symbol);

        // This line will grab the text from the input box
        const stock = $('#stockName').val().trim();
    
        // validating to make sure only valid stock symbols are accepted
        if(validationList.includes(stock) && !stocksList.includes(stock)){
     
            stocksList.push(stock);
  
            // Deletes the contents of the input
            $('#stockName').val('');

            render();
        }  

        }  

    })

}

//Event listeners
$('#add').on('click', addButton);       
$('#buttons').on('click', '.stk', displayInfo);

render();