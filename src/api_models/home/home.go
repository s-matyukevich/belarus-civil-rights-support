package home

//API models for the home page
//API models are denormalized models. They are built directly from the mockups and they are the objects that backend API passes to the frontend

type Filters struct {
	Search        string `form:"Search"`
	Cities        []int  `form:"Cities"`     // empty list here means all cities
	Categories    []int  `form:"Categories"` // empty = all
	Page          int    `form:"Page"`
	SortColumn    string `form:"SortColumn" validate:"oneof=created_at rating"`
	SortDirection string `form:"SortDirection" validate:"oneof=ASC DESC"`
}

type Story struct {
	ID             uint
	VideoUrl       string
	Title          string
	Description    string
	Upvotes        int
	Downvotes      int
	UserUpvoted    bool
	UserDownvoted  bool
	AuthorName     string
	AuthorId       uint // always use uint for the foreign key referencies
	AuthorImageURL string
}
