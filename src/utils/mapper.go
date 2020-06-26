package utils

import "reflect"

func Map(from, to interface{}) {
	fromV := reflect.ValueOf(from).Elem()
	toV := reflect.ValueOf(to).Elem()

	for i := 0; i < toV.NumField(); i++ {
		toField := toV.Field(i)
		name := toV.Type().Field(i).Name
		fromField := fromV.FieldByName(name)
		if fromField.IsValid() && fromField.Type().AssignableTo(toField.Type()) {
			toField.Set(fromField)
		}
	}
}
