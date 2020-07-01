package api_models

type Status struct {
	ID      uint
	Errors  map[string]string
	Success string
}
