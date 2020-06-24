package home

//API models for the home page
//API models are denormalized models. They are built directly from the mockups and they are the objects that backend API passes to the frontend

type FilterParameters struct {
	Cities        []string // empty list here means all cities
	Categories    []string // empty = all
	SortBy        string   //One of the: "date", "rating"
	SortDirection string   // asc of dec
}

type Story struct {
	Id            uint
	Title         string
	Description   string
	AuthorName    string
	AuthorId      uint // always use uint for the foreign key referencies
	AthorImageURL string
	Rating        int
	Page          int //we don't use paginator, but we download new items on demand while scrolling down
}
