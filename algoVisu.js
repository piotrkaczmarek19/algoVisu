(function (){
	this.AlgoVisu = function ()
	{
		var defaults = {
			code_str				: "",
			code_nodes				: "",
			display_node			: ".code_container",
			indentation_intensity	: 3
		}
		self = this;
		this.options = defaults;

		Object.prototype.extend = function (obj)
		{
			for (var key in obj)
			{
				this[key] = obj[key];
			}
		}

		if (arguments[0] && typeof arguments[0] === "object")
		{
			this.options.extend(arguments[0]);
		}
		
		self.init();
	}

	// Generate variables and display formatted content in DOM
	AlgoVisu.prototype.init = function ()
	{
		self.highlightCode();
		self.indentCode();
		self.displayCode();
	}
	// Generate indentation nodes for raw code
	AlgoVisu.prototype.indentCode = function ()
	{
		// splitting string with delimiter being each opening brace
		var code_arr = self.options.code_str.split("{");
		// Initial indent
		var indent = 1;
		for (var i = 0; i < code_arr.length; i++)
		{
			var curr_str = code_arr[i];	
			// wrap str in tabulation div
			curr_str = "<div class='indent_wrapper "+indent+"' data-indent="+indent+">" + curr_str
			for (var j = 0; j < curr_str.length; j++)
			{
				// decrease indent with each closing brace
				if (curr_str.charAt(j + 1) === "}") 
				{
					indent --;
					curr_str = curr_str.substring(0, j) + "</div>}" + curr_str.substring(j + 2);
					// increment pointer to avoid infinite loop
					j += 5;
				}
				if (curr_str.charAt(j) === "\n")
				{
					curr_str = curr_str.substring(0, j) + "<br>" + curr_str.substring(j + 1);
				}
			}
			// indent increases with each opening brace
			indent ++;
			// close tabluation div
			curr_str = curr_str + "{";
			// replace string in array
			code_arr[i] = curr_str;
		} 
		code = code_arr.join("");
		code = code.substring(0, code.length - 1);	
		
		self.code_nodes = code;
	}
	AlgoVisu.prototype.highlightCode = function ()
	{
		// Adding color and styling
		var blue_str_pattern = /(length|Math\.max|Math\.min|var|function|\.(\w+))/g,
			red_str_pattern = /(if|\+|for|return|&|\s<\s|\s>\s|<=|>=|-)/g,
			comment_str_pattern = /(\/\/.+\n)/g,
			integer_str_pattern = /([0-9])/g,
			orange_str_pattern = /(function)\((.+)\)/g,
			green_str_pattern = /(var\s)(.+)(\s?=\s?function)/g;

		self.options.code_str = self.options.code_str
		// highlighting function arguments in orange
		.replace(orange_str_pattern, "$1(<span style='color:orange'>$2</span>)")
		// highlighting integers in purple
		.replace(integer_str_pattern, "<span style='color:#977ee6'>$1</span>")
		// Highlighting function namespaces in green
		.replace(green_str_pattern, "$1<span style='color:#8fda3e'>$2</span> $3")
		// Highlighting comments in gray
		.replace(comment_str_pattern, "<span style='color:#6d6855'>$1</span>")
		// Highlighting logical constructs in red
		.replace(red_str_pattern, "<span style='color:#d9265e'>$1</span>")
		// highlighting methods in blue
		.replace(blue_str_pattern, "<span style='color:#73d0d3'>$1</span>");
	}
	// display formated code within chosen div
	AlgoVisu.prototype.displayCode = function ()
	{
		var container = document.querySelector(self.options.display_node);
		var textNode = document.createTextNode(code);
		container.innerHTML = code;

		// display indentation
		var $indentation_blocks = document.querySelectorAll('.indent_wrapper');
		for (var i = 0; i < $indentation_blocks.length; i++)
		{
			var margin = i * self.options.indentation_intensity;
			$indentation_blocks[i].style.marginLeft = margin + "%";
		}
	}
}());
