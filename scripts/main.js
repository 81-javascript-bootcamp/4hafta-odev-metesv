import data from "./data.js";
import {searchMovieByTitle, makeBgActive, onlyUnique} from "./helpers.js";

class MoviesApp {
    constructor(options) {
        const {root, searchInput, searchForm, yearHandler, yearSubmitter ,tbody, genreContainer, yearContainer, genreFilterBtn} = options;
        this.$tableEl = document.getElementById(root);
        this.$tbodyEl = this.$tableEl.querySelector(tbody);
        
        this.$searchInput = document.getElementById(searchInput);
        this.$searchForm   = document.getElementById(searchForm);
        
        this.$yearContainerEl = document.querySelector(yearContainer);
        this.yearHandler = yearHandler;
        this.$yearSubmitter = document.getElementById(yearSubmitter);

        this.$genreContainerEl = document.querySelector(genreContainer);
        this.$genreFilterBtnEl = document.querySelector(genreFilterBtn);
    }

    createMovieEl(movie){
        const {image, title, genre, year,id} = movie;
        return `<tr data-id="${id}"><td><img src="${image}"></td><td>${title}</td><td>${genre}</td><td>${year}</td></tr>`
    }

    fillTable(){
        /* const moviesHTML = data.reduce((acc, cur) => {
            return acc + this.createMovieEl(cur);
        }, "");*/
        const moviesArr = data.map((movie) => {
           return this.createMovieEl(movie)
        }).join("");
        this.$tbodyEl.innerHTML = moviesArr;
    }

    reset(){
        this.$tbodyEl.querySelectorAll("tr").forEach((item) => {
            item.style.background = "transparent";
        })
    }


    handleSearch(){
        this.$searchForm.addEventListener("submit", (event) => {
            event.preventDefault();
            this.reset();
            const searchValue = this.$searchInput.value;
            const matchedMovies = data.filter((movie) => {
                return searchMovieByTitle(movie, searchValue);
            }).forEach(makeBgActive)
            this.$searchInput.value = "";
        });
    }

    fillYear(){
        const yearArray = data.map(movie => movie.year);
        const uniqueYears = yearArray.filter(onlyUnique);
        uniqueYears.sort((a,b) => {
            return a - b;
        })
        uniqueYears.forEach((year) => {
            this.createYearRadio(year);
        })
    }

    createYearRadio(year){
        const div = document.createElement("div");
        div.classList.add("form-check");
        const input = document.createElement("input");
        input.classList.add("form-check-input");
        input.type = "radio";
        input.name = "year";
        input.id = "year-" + year;
        input.value = year;
        const label = document.createElement("label");
        label.classList.add("form-check-label");
        label.textContent = year;
        div.appendChild(input);
        div.appendChild(label);
        this.$yearContainerEl.insertBefore(div, this.$yearSubmitter);
    }

    handleYearFilter(){
        this.$yearSubmitter.addEventListener("click", () => {
            this.reset();
            const selectedYear = document.querySelector(`input[name='${this.yearHandler}']:checked`).value
            const matchedMovies = data.filter((movie) => {
                return movie.year === selectedYear;
            }).forEach(makeBgActive)
        });
    }

    fetchGenre(){
        const genreData = {};
        data.forEach((data) => {
            if(genreData.hasOwnProperty(data.genre)){
                genreData[data.genre] += 1;
            } else {
                genreData[data.genre] = 1;
            }
        })
        return genreData;
    }

    createGenreCheckBox(genre, count){
        const div = document.createElement("div");
        div.classList.add("form-check");
        const input = document.createElement("input");
        input.classList.add("form-check-input");
        input.type = "checkbox";
        input.name = "genre";
        input.value = genre;
        input.id = genre;
        const label = document.createElement("label");
        label.classList.add("form-check-label");
        label.for = genre;
        label.textContent = `${genre} (${count})`;
        div.appendChild(input);
        div.appendChild(label);
        this.$genreContainerEl.insertBefore(div, this.$genreFilterBtnEl);
    }

    fillGenre(){
        const genreData = this.fetchGenre();
        for(const genre in genreData){
            this.createGenreCheckBox(genre, genreData[genre]);
        }
    }

    handleGenreFilter(){
        this.$genreFilterBtnEl.addEventListener("click", (event) => {
            this.reset();
            const selectedGenres = Array.from(document.querySelectorAll(`input[type='checkbox']:checked`)).map(genre => genre.value);
            const matchedGenres = data.filter((el) => {
                return selectedGenres.includes(el.genre);
            }).forEach(makeBgActive);
        }) 
    }

    init(){
        this.fillTable();
        this.fillGenre();
        this.fillYear();
        this.handleSearch();
        this.handleYearFilter();
        this.handleGenreFilter();
    }
}

let myMoviesApp = new MoviesApp({
    root: "movies-table",
    tbody: "tbody",
    searchInput: "searchInput",
    searchForm: "searchForm",
    yearHandler: "year",
    yearSubmitter: "yearSubmitter",
    yearContainer:"#year-container",
    genreContainer: "#genre-container",
    genreFilterBtn: "#genre-filter-btn"
});

myMoviesApp.init();
