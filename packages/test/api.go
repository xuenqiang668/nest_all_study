package main

import "C"

//export Add
func Add(a, b int) int {
	return a + b
}

//export Multiply
func Multiply(a, b int) int {
	return a * b
}

func main() {
	// 这个main函数只是为了让Go编译通过，实际上没有任何作用
}