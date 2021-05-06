var cardData = {permalink:"furrnace",theme:"default",title:"Name",description:"Enter a description here.",cards:{}}
var editingCard = ""
var editingCardE = ""
var deletingCard = ""

//prevent enter galore
$("#title").keypress(function(e){ return e.which != 13; });
$("#desc").keypress(function(e){ return e.which != 13; });
$("#setdomain").keypress(function(e){ return e.which != 13; });
$("#colorinput").keypress(function(e){ return e.which != 13; });
$("#urlpopup").keypress(function(e){ return e.which != 13; });
$("#cardwidth").keypress(function(e){ return e.which != 13; });
$("#cardheight").keypress(function(e){ return e.which != 13; });

function importYAML(){
    var text = document.getElementById("codeimmport")
    var testformatted = "---"+text.innerHTML.replace(/(<|&lt;)br\s*\/*(>|&gt;)/g," ").replace(/---/g,"")
    loadSettings(testformatted)
}

function loadSettings(string){
    json = YAML.parse(string);

    document.getElementById("title").innerHTML = json.title
    document.getElementById("desc").innerHTML = json.description

    document.documentElement.setAttribute("data-theme", json.theme);
    Object.entries(json.cards).forEach(([key, value]) => importCards(key,value))

    document.getElementById("importpage").style.display = "none"
}

function newProject(){
    document.getElementById("importpage").style.display = "none"
    document.getElementById("themeselector").style.display = "block"
}

function createElement(type,parentelement,style,id,editable,onclick,src,onpaste,onkeypress,onkeyup){
    var newElement = document.createElement(type)
    parentelement.append(newElement)
    if(style !== undefined){
        newElement.setAttribute("class",style)
    }
    if(id !== undefined){
        newElement.setAttribute("id",id)
    }
    if(editable !== undefined){
        newElement.setAttribute("contenteditable",editable)
    }
    if(onclick !== undefined){
        newElement.setAttribute("onclick",onclick)
    }
    if(src !== undefined){
        newElement.setAttribute("src",src)
    }
    if(onpaste !== undefined){
        newElement.setAttribute("onpaste",onpaste)
    }
    if(onkeypress !== undefined){
        newElement.setAttribute("onkeypress",onkeypress)
    }
    if(onkeyup !== undefined){
        newElement.setAttribute("onkeyup",onkeyup)
    }
    return newElement
}

function plainText(event){
    event.preventDefault()
    document.execCommand('inserttext',false,event.clipboardData.getData('text/plain'))
}

function deleteCancel(){
    document.getElementById("deleteconfirm").className = "deletepopup popout"
    setTimeout(function(){ document.getElementById("deleteconfirm").style.display = "none" },150)
}

function deleteClose(){
    document.getElementById("deleteconfirm").className = "deletepopup popout"
    setTimeout(function(){ document.getElementById("deleteconfirm").style.display = "none" },150)
}

function deleteConfirm(){
    deletingCard.parentNode.removeChild(deletingCard)
    delete cardData.cards[deletingCard.getAttribute("id")]
    deleteClose()
}

function deleteCard(id){
    document.getElementById("deleteconfirm").style.display = "block"
    document.getElementById("deleteconfirm").className = "deletepopup popin"
    deletingCard = id
}

function updateCardData(){
    var title = document.getElementById("title").innerHTML
    var description = document.getElementById("desc").innerHTML
    var domain = document.getElementById("setdomain").innerHTML

    cardData.permalink = ("/"+domain)
    cardData.title = title
    cardData.description = description
}

function buildCard(id,ctitle,cprice,cblurb,cimage,cfullimage,cuseimage,ccolor,cenabletitle,cenableprice,cenableblurb,ccustomsize,cwidth,cheight,cenabled){
    if(id == undefined){
        var id = ('_' + Math.random().toString(36).substr(2,9))
    }
    var panelContainer = document.getElementById("panelcontainer")
    var card = createElement("div",panelContainer,"editor-panel-column",id)
    var img = ""
    panelContainer.insertBefore(card, card.previousElementSibling);

    createElement("i",card,"editor-panel-edit fas fa-pen",("edit"+id),undefined,"editCard("+id+")")
    createElement("i",card,"editor-panel-delete fas fa-trash-alt",("delete"+id),undefined,"deleteCard("+id+")")
    var image = createElement("div",card,"editor-panel-column-image",("image"+id))

    if(cimage == undefined){
        image.style.backgroundImage = "url('https://i.imgur.com/gxbgbAg.png')"
        img = "https://i.imgur.com/gxbgbAg.png"
    } else {
        image.style.backgroundImage = "url("+cimage+")"
        img = cimage
    }

    var details = createElement("div",card,"editor-panel-column-details",("details"+id))
    var title = createElement("h1",details,undefined,("title"+id),"true",undefined,undefined,"plainText(event)","updateCardData()")
    var price = createElement("h2",details,undefined,("price"+id),"true",undefined,undefined,"plainText(event)","updateCardData()")
    var blurb = createElement("p",details,undefined,("blurb"+id),"true",undefined,undefined,"plainText(event)","updateCardData()")
    var enabled = true
    var fullimage = false
    var useimage = true
    var color = "#5649c0"
    var enabletitle = true
    var enableprice = true
    var enableblurb = true
    var customsize = false
    var width = 355
    var height = 590

    if(ctitle == undefined){
        title.innerHTML = "My Product"
    } else {
        title.innerHTML = ctitle
    }

    if(cprice == undefined){
        price.innerHTML = "$5.00 NZD"
    } else {
        price.innerHTML = cprice
    }

    if(cblurb == undefined){
        blurb.innerHTML = "Enter a product description here!"
    } else {
        blurb.innerHTML = cblurb
    }

    if(ccolor !== undefined){
        card.style.backgroundColor = ccolor
    } else {

    }

    if(cuseimage !== false){
        if(cfullimage == true){
            card.style.backgroundImage = "url("+img+")"
            card.style.backgroundSize = "cover"
            card.style.backgroundPosition = "center"
            image.style.display = "none"
            title.style.display = "none"
            price.style.display = "none"
            blurb.style.display = "none"
            details.style.display = "none"
        }
    } else {
        img.style.display = "none"
    }

    if(cenabletitle !== true){
        title.style.display = "none"
    }

    if(cenableprice !== true){
        price.style.display = "none"
    }

    if(cenableblurb !== true){
        blurb.style.display = "none"
    }

    if(ccustomsize == true){
        if(cwidth !== undefined){
            width = cwidth
            card.style.width = cwidth
        }

        if(cheight !== undefined){
            height = cheight
            card.style.height = cheight
        }
    }

    if(cenabled == false){
        enabled = false
    }

    cardData.cards[id] = {enabled:enabled,fullimage:fullimage,useimage:useimage,img:img,title:title.innerHTML,price:price.innerHTML,blurb:blurb.innerHTML,color:color,enabletitle:enabletitle,enableprice:enableprice,enableblurb:enableblurb,customsize:customsize,width:width,height:height}
}

function importCards(key,value){
    buildCard(key,value.title,value.price,value.blurb,value.img,value.fullimage,value.useimage,value.color,value.enabletitle,value.enableprice,value.enableblurb,value.customsize,value.width,value.height,value.enabled)
}

function editCard(id,apply){
    if(id !== undefined){
        editingCard = id
        editingCardE = id.getAttribute("id")

        document.getElementById("edit_enablecard").checked = cardData.cards[editingCardE].enabled
        document.getElementById("edit_image").checked = cardData.cards[editingCardE].useimage
        document.getElementById("edit_imagefill").checked = cardData.cards[editingCardE].fullimage
        document.getElementById("edit_title").checked = cardData.cards[editingCardE].enabletitle
        document.getElementById("edit_price").checked = cardData.cards[editingCardE].enableprice
        document.getElementById("edit_blurb").checked = cardData.cards[editingCardE].enableblurb
        document.documentElement.style.setProperty("--colorselector",cardData.cards[editingCardE].color)
        document.getElementById("colorinput").innerHTML = cardData.cards[editingCardE].color
        document.getElementById("urlpopup").innerHTML = cardData.cards[editingCardE].img
        document.getElementById("edit_customsize").checked = cardData.cards[editingCardE].customsize

        if(cardData.cards[editingCardE].customsize == true){
            document.getElementById(editingCardE).style.width = cardData.cards[editingCardE].width
            document.getElementById(editingCardE).style.height = cardData.cards[editingCardE].height
            document.getElementById("cardwidth").innerHTML = cardData.cards[editingCardE].width
            document.getElementById("cardheight").innerHTML = cardData.cards[editingCardE].height
        } else if(cardData.cards[editingCardE].customsize == false){
            document.getElementById("cardwidth").innerHTML = document.getElementById(editingCardE).clientWidth
            document.getElementById("cardheight").innerHTML = document.getElementById(editingCardE).clientHeight
        }
    }

    document.getElementById("cardedit").style.display = "block"
    document.getElementById("cardedit").className = "cardedit popin"
    document.documentElement.style.setProperty("--colorselector",document.getElementById("colorinput").innerHTML)
    if(apply == true){
        document.getElementById(editingCardE).style.backgroundColor = document.getElementById("colorinput").innerHTML
        cardData.cards[editingCardE].enabled = document.getElementById("edit_enablecard").checked
        cardData.cards[editingCardE].fullimage = document.getElementById("edit_imagefill").checked
        cardData.cards[editingCardE].useimage = document.getElementById("edit_image").checked
        cardData.cards[editingCardE].color = document.getElementById("colorinput").innerHTML
        cardData.cards[editingCardE].customsize = document.getElementById("edit_customsize").checked
        cardData.cards[editingCardE].img = document.getElementById("urlpopup").innerHTML
        document.getElementById("image"+editingCardE).style.backgroundImage = "url("+document.getElementById("urlpopup").innerHTML+")"
    }

    document.getElementById("urlpopup").addEventListener("keydown",function(event){
        if(event.code === "Enter"){
            event.preventDefault();
            cardData.cards[editingCardE].img = document.getElementById("urlpopup").innerHTML
            document.getElementById("image"+editingCardE).style.backgroundImage = "url("+document.getElementById("urlpopup").innerHTML+")"
        }
    })

    if(document.getElementById("edit_enablecard").checked == true){
        document.getElementById("edit_customsize").disabled = false
        document.getElementById("edit_image").disabled = false
        document.getElementById("urlpopup").setAttribute("contenteditable","true")
        document.getElementById("colorinput").setAttribute("contenteditable","true")
        document.getElementById("urlpopup").style.cursor = null
        document.getElementById("colorinput").style.cursor = null

        if(document.getElementById("edit_customsize").checked == true){
            if(apply == true){
                var maxWidth = 9999
                var maxHeight = 9999
                var minWidth = 40
                var minHeight = 40
                var width = Number(document.getElementById("cardwidth").innerHTML)
                var height = Number(document.getElementById("cardheight").innerHTML)
            
                if(width > minWidth && width < maxWidth){
                    document.getElementById(editingCardE).style.width = document.getElementById("cardwidth").innerHTML
                }
        
                if(height > minHeight && height < maxHeight){
                    document.getElementById(editingCardE).style.height = document.getElementById("cardheight").innerHTML
                }
            }

            document.getElementById("cardwidth").disabled = false
            document.getElementById("cardheight").disabled = false
            document.getElementById("cardwidth").setAttribute("contenteditable","true")
            document.getElementById("cardheight").setAttribute("contenteditable","true")
            document.getElementById("cardwidth").style.cursor = null
            document.getElementById("cardheight").style.cursor = null
        } else if(document.getElementById("edit_customsize").checked == false){
            if(apply == true){
                document.getElementById(editingCardE).style.width = null
                document.getElementById(editingCardE).style.height = null
            }

            document.getElementById("cardwidth").disabled = true
            document.getElementById("cardheight").disabled = true
            document.getElementById("cardwidth").setAttribute("contenteditable","false")
            document.getElementById("cardheight").setAttribute("contenteditable","false")
            document.getElementById("cardwidth").style.cursor = "not-allowed"
            document.getElementById("cardheight").style.cursor = "not-allowed"
        }

        if(document.getElementById("edit_image").checked == true){
            if(apply == true){
                document.getElementById("image"+editingCardE).style.display = "block"
            }
            document.getElementById("edit_imagefill").disabled = false

            if(document.getElementById("edit_imagefill").checked == true){
                if(apply == true){
                    document.getElementById(editingCardE).style.backgroundImage = "url("+cardData.cards[editingCardE].img+")"
                    document.getElementById(editingCardE).style.backgroundSize = "cover"
                    document.getElementById(editingCardE).style.backgroundPosition = "center"
                    document.getElementById("image"+editingCardE).style.display = "none"
                    document.getElementById("title"+editingCardE).style.display = "none"
                    document.getElementById("price"+editingCardE).style.display = "none"
                    document.getElementById("blurb"+editingCardE).style.display = "none"
                    document.getElementById("details"+editingCardE).style.display = "none"
                    cardData.cards[editingCardE].enabletitle = false
                    cardData.cards[editingCardE].enableprice = false
                    cardData.cards[editingCardE].enableblurb = false
                }
                document.getElementById("edit_title").disabled = true
                document.getElementById("edit_price").disabled = true
                document.getElementById("edit_blurb").disabled = true
                document.getElementById("edit_title").checked = false
                document.getElementById("edit_price").checked = false
                document.getElementById("edit_blurb").checked = false

            } else if(document.getElementById("edit_imagefill").checked == false){
                if(apply == true){
                    document.getElementById(editingCardE).style.backgroundImage = null
                    document.getElementById(editingCardE).style.backgroundSize = null
                    document.getElementById(editingCardE).style.backgroundPosition = null
                    document.getElementById("details"+editingCardE).style.display = "block"
                    cardData.cards[editingCardE].enabletitle = true
                    cardData.cards[editingCardE].enableprice = true
                    cardData.cards[editingCardE].enableblurb = true
                }
                document.getElementById("edit_title").disabled = false
                document.getElementById("edit_price").disabled = false
                document.getElementById("edit_blurb").disabled = false
            }
        } else if(document.getElementById("edit_image").checked == false){
            if(apply == true){
                document.getElementById("image"+editingCardE).style.display = "none"
            }
            document.getElementById("edit_imagefill").disabled = true
        }

        if(apply == true){
            if(document.getElementById("edit_title").checked == true){
                document.getElementById("title"+editingCardE).style.display = "block"
                cardData.cards[editingCardE].enabletitle = true
            } else if(document.getElementById("edit_title").checked == false){
                document.getElementById("title"+editingCardE).style.display = "none"
                cardData.cards[editingCardE].enabletitle = false
            }

            if(document.getElementById("edit_price").checked == true){
                document.getElementById("price"+editingCardE).style.display = "block"
                cardData.cards[editingCardE].enableprice = true
            } else if(document.getElementById("edit_price").checked == false){
                document.getElementById("price"+editingCardE).style.display = "none"
                cardData.cards[editingCardE].enableprice = false
            }

            if(document.getElementById("edit_blurb").checked == true){
                document.getElementById("blurb"+editingCardE).style.display = "block"
                cardData.cards[editingCardE].enableblurb = true
            } else if(document.getElementById("edit_blurb").checked == false){
                document.getElementById("blurb"+editingCardE).style.display = "none"
                cardData.cards[editingCardE].enableblurb = false
            }
        }
    } else if(document.getElementById("edit_enablecard").checked == false){
        document.getElementById("cardwidth").style.cursor = "not-allowed"
        document.getElementById("cardheight").style.cursor = "not-allowed"
        document.getElementById("urlpopup").style.cursor = "not-allowed"
        document.getElementById("colorinput").style.cursor = "not-allowed"
        document.getElementById("edit_image").disabled = true
        document.getElementById("edit_imagefill").disabled = true
        document.getElementById("edit_title").disabled = true
        document.getElementById("edit_price").disabled = true
        document.getElementById("edit_blurb").disabled = true
        document.getElementById("edit_customsize").disabled = true
        document.getElementById("cardwidth").disabled = true
        document.getElementById("cardheight").disabled = true
        document.getElementById("cardwidth").setAttribute("contenteditable","false")
        document.getElementById("cardheight").setAttribute("contenteditable","false")
        document.getElementById("urlpopup").setAttribute("contenteditable","false")
        document.getElementById("colorinput").setAttribute("contenteditable","false")
        if(apply == true){
            cardData.cards[editingCardE].enabletitle = false
            cardData.cards[editingCardE].enableprice = false
            cardData.cards[editingCardE].enableblurb = false
        }
    }
}

function close_editCard(){
    document.getElementById("cardedit").className = "cardedit popout"
    setTimeout(function(){ document.getElementById("cardedit").style.display = "none" },150)
}

function addColumn(){
    buildCard(undefined,undefined,undefined,undefined,undefined,false,true,undefined,true,true,true,false,undefined,undefined,true)
}

function pageFinish(){
    document.getElementById("panelcontainer").style.display = "none"
    document.getElementById("finishpage").style.display = "block"
}

function loadFinish(){
    document.getElementById("domaincontainer").style.display = "none"
    document.getElementById("loader").style.display = "block"
    document.getElementById("loadingbar").style.width = "0px"
    setTimeout(function(){ fakeload() },500)
    setTimeout(function(){ pageFinished(); document.getElementById("loader").style.display = "none"},3000)
}

function pageFinished(){
    document.getElementById("codeoutput").innerHTML = "---<br>"+YAML.stringify(cardData,1,4).replace(/(?:\n)/g,"<br>")+"---"
    document.getElementById("finishcode").style.display = "block"
}

function domainCharCheck(){
    var maxLength = 16
    var text = document.getElementById("setdomain")
    var length = text.innerHTML.length

    if(length > maxLength){
        document.getElementById("domainbox").style.borderColor = "var(--color-danger)"
        var warningmessage = document.getElementById("domainalert")
        warningmessage.innerHTML = "Maximum length is 16 characters."
    } else if(length == 0){
        document.getElementById("domainbox").style.borderColor = "var(--color-danger)"
        var warningmessage = document.getElementById("domainalert")
        warningmessage.innerHTML = "Url cannot be empty"
    } else if(length < maxLength){
        document.getElementById("domainbox").style.borderColor = "#eaecef"
        var warningmessage = document.getElementById("domainalert")
        warningmessage.innerHTML = ""
    }

    text.addEventListener("keyup",function(event){
        if(event.code === "Enter"){
            event.preventDefault();

            if(length > maxLength){
                document.getElementById("domainbox").style.borderColor = "var(--color-danger)"
                var warningmessage = document.getElementById("domainalert")
                warningmessage.innerHTML = "Maximum length is 16 characters."
            } else if(length == 0){
                document.getElementById("domainbox").style.borderColor = "var(--color-danger)"
                var warningmessage = document.getElementById("domainalert")
                warningmessage.innerHTML = "Url cannot be empty"
            } else if(length < maxLength){
                document.getElementById("domainbox").style.borderColor = "#eaecef"
                var warningmessage = document.getElementById("domainalert")
                warningmessage.innerHTML = ""
                cardData.permalink = text.innerHTML
                loadFinish()
            }
        }
    })
}

function checkWidth(){
    var maxLength = 9999
    var minLength = 40
    var text = document.getElementById("cardwidth")
    var length = Number(text.innerHTML)

    if(length > maxLength){
        document.getElementById("cardwidth").style.borderColor = "var(--color-danger)"
    } else if(length < minLength){
        document.getElementById("cardwidth").style.borderColor = "var(--color-danger)"
    } else if(length > minLength){
        document.getElementById("cardwidth").style.borderColor = "#eaecef"
    }
}

function checkHeight(){
    var maxLength = 9999
    var minLength = 40
    var text = document.getElementById("cardheight")
    var length = Number(text.innerHTML)

    if(length > maxLength){
        document.getElementById("cardheight").style.borderColor = "var(--color-danger)"
    } else if(length < minLength){
        document.getElementById("cardheight").style.borderColor = "var(--color-danger)"
    } else if(length > minLength){
        document.getElementById("cardheight").style.borderColor = "#eaecef"
    } 
}

function setTheme(id,force){
    var button = document.getElementById(id)
    if(button.checked == false){
        button.checked = true
        document.documentElement.setAttribute("data-theme", button.value);
        cardData.theme = button.value
    } else if (force == true){
        button.checked = true
        document.documentElement.setAttribute("data-theme", button.value);
        cardData.theme = button.value        
    }
}

function setThemeFinish(){
    document.getElementById("themeselector").style.display = "none"
    document.getElementById("loader").style.display = "block"
    setTimeout(function(){ fakeload() },400)
    setTimeout(function(){ document.getElementById("loader").style.display = "none" },3000)
}

var progress = {
	fill: document.getElementById("loadingbar"),
	bar: document.getElementById("loader-container"),
	width: 0
};

function setSize() {
	var allowance = progress.bar.offsetWidth - progress.width;
	var increment = Math.floor(Math.random() * 50 + 1);
	progress.width += increment > allowance ? allowance : increment;
	progress.fill.style.width = String(progress.width + "px");
}

function fakeload() {
	var randomInterval = Math.round(Math.random() * (100));
	var setInt = setTimeout(function() {
		setSize();
		if (progress.width >= progress.bar.offsetWidth) {
			clearInterval(setInt);
			setTimeout(function() {
				progress.width = 0
			}, randomInterval);
			return false;
		}
		fakeload();
	}, randomInterval);
}
