package api_models

type Status struct {
	ID      uint
	Errors  map[string]interface{}
	Success string
}
