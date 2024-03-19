document.getElementById("buscar").addEventListener("click", mostrarData,true);
document.getElementById("favoritos").addEventListener("click", agregarFavoritos,true);
let contenido = document.querySelector(".contenido");
const cocktailFavorite = [];
let info = {};
localStorage.clear();

    function cargando(){
        contenido.innerHTML =  `
            <div class="pantCarga">
                <h4 class="bold">Loading...</h4>
                <progress></progress>
            </div>
        `; 
    }

    function detailCocktail(data){
        setTimeout(() => {
            /*console.log(data.drinks[0]);*/
            /*info = `ID: ${data.drinks[0]?.idDrink ?? ""}, Nombre: ${data.drinks[0]?.strDrink ?? ""}`;*/
            info = {
                ID: data.drinks[0]?.idDrink ?? "",
                Nombre: data.drinks[0]?.strDrink ?? ""
            };

            let ingredientes = "";
            let instancia1 = {};
            let instancia2 = {};
            for (let i = 1; i <= 15; i++) {
                elemento = data.drinks[0]?.[`strIngredient${i}`] ?? "";
                cantidad = data.drinks[0]?.[`strMeasure${i}`] ?? "";
                instancia1["strIngredient"+`${i}`] = elemento;
                instancia2["strMeasure"+`${i}`] = cantidad;
                if (elemento != "") {
                    /*console.log(elemento);
                    console.log(cantidad);*/
                    ingredientes += `${cantidad} ${elemento} - `;
                }
                /*console.log(ingredientes)*/
            }

            contenido.innerHTML =  `
                <img alt="cocktail" id="imagenCocktail" src="${data.drinks[0].strDrinkThumb}"/>
                <div class="informacionCocktail">
                    <p><span class="bold">ID:</span> ${data.drinks[0]?.idDrink ?? ""}</p>
                    <p><span class="bold">Name:</span> ${data.drinks[0]?.strDrink ?? ""}</p>
                    <p><span class="bold">Category:</span> ${data.drinks[0]?.strCategory ?? ""}</p>
                    <p><span class="bold">Ingredients:</span> ${ingredientes}</p>
                    <p><span class="bold">Preparation:</span> ${data.drinks[0]?.strInstructions ?? ""}</p>
                </div>
            `;
            }, 1000);
    }


    function mostrarData (){
        fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php")
            .then((response) => response.json())
            .then((data) => detailCocktail(data))
            .catch((error) => {
                throw new Error("Error " + response.status + " al llamar al API: " + response.statusText + ": " + error);
            })
        cargando();
        }   

    
    function agregarFavoritos(){
        if (cocktailFavorite.includes(info)) {
            return;
        } else {
            cocktailFavorite.push(info);
            localStorage.setItem(JSON.stringify(info.ID), JSON.stringify(info.Nombre));
        }
        /*console.log(cocktailFavorite);*/
        mostrarFavoritos();
    }

    function verDetalles(id){
        console.log(id);
        fetch ("https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i="+id)
            .then((response) => response.json())
            .then((data) => detailCocktail(data))
            .catch((error) => {
                throw new Error("Error " + response.status + " al llamar al API: " + response.statusText + ": " + error);
            })
        cargando();
    }

    function mostrarFavoritos(){
        const listaFav = document.getElementById("listaCocktail");
        listaFav.innerHTML = "";
        for (let i = 0; i < localStorage.length; i++) {
            let clave = localStorage.key(i);
            let valor = localStorage.getItem(clave);
            console.log(clave + ": " + valor);
            const cocktailHtml = `
                <li>
                    <div>
                        <p><span class="bold">ID and Name:</span> ${clave}: ${valor}<p>
                        <button type="button" id="detalles" onclick="verDetalles(${JSON.parse(clave)})">See details</button>
                    </div>
                </li>`;
            /*const cocktailHtml = `
                <li>
                    <div>
                        <p><span class="bold">ID:</span> ${coctel.ID}</p>
                        <p><span class="bold">Name:</span> ${coctel.Nombre}<p>
                        <button type="button" id="detalles" onclick="verDetalles(${coctel.ID})">See details</button>
                    </div>
                </li>`;*/
            listaFav.innerHTML += cocktailHtml;
        }  
    }