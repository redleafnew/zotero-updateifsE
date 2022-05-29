library(pacman)
p_load(rio, jsonlite, tidyverse)

setwd('E:/我的坚果云/soft/git/zotero-updateifs/')
ifsxls <- import('E:/我的坚果云/soft/git/zotero-updateifs/ifs.csv') %>% as_tibble()

ifsxls |>
  split(~full) |> 
  lapply(function(x) unlist(subset(x, select=-full))) |> 
  jsonlite::toJSON(pretty=TRUE)|> 
cat(file = 'json.txt', fill = FALSE, labels = NULL, append = FALSE)
