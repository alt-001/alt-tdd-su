alt.filter 'wordsTrunc', ->
  (value, max) ->
    if !value
      return ''
    max = parseInt(max, 10)
    if !max || value.length <= max
      return value
    else
    	return value.substr(0, max) + ' …'