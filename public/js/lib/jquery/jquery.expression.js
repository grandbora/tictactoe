$.expr[":"].mod = function(el, i, m)
{
	return i % m[3] === 0;
};
$.expr[":"].sub_mod = function(el, i, m)
{
	var params = m[3].split(",");
	return (i - params[0]) % params[1] === 0;
};