{
  "targets": [
    {
      "target_name": "myapi",
      "sources": ["api.go"],
      "cflags": ["-Wall"],
      "cflags_cc!": ["-fno-exceptions"],
      "ldflags": ["-shared"]
    }
  ]
}