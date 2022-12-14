let inputCantidad = document.querySelector("#inputCantidad");
const tipoMoneda = document.querySelector("#tipoMoneda");
const btnBuscar = document.querySelector("#btnBuscar");
const conversion = document.querySelector("#conversion");
const error = document.querySelector("#error");
const chartDOM = document.querySelector("#myChart");
let myChart;

async function getMonedas() {
    try {
        const response = await fetch("https://mindicador.cl/api/");
        if(!response.ok) throw "NO SE PUDO REALIZAR LA SOLICITUD"
        const arrayMonedas = await response.json();
        return arrayMonedas;
    } catch (e) {
        error.innerHTML = e
    }
}

async function renderGrafica(monedaElegida) {
    const data = await getMonedasDays(monedaElegida);
    const config = {
        type: "line",
        data
    };
    chartDOM.style.backgroundColor = "white";
    if (myChart) {
        myChart.destroy();
    }
    myChart = new Chart(chartDOM, config);
}


async function conversor(moneda) {
    const data = await getMonedas()
    if(!data) return
    renderGrafica(moneda);
    let cantidad = Number(inputCantidad.value)
    let division = (cantidad / data[moneda].valor).toFixed(2)
    conversion.innerHTML = `<p>Resultado: $ ${division}</p>`
}

async function getMonedasDays(monedaElegida) {
    try {
        const response = await fetch("https://mindicador.cl/api/" + monedaElegida);
        const arrayMonedas = await response.json();
        const ultimosDias = arrayMonedas.serie.slice(0, 10).reverse()
        const labels = ultimosDias.map((dia) => dia.fecha.split("T")[0].split("-").reverse().join("-"));
        const data = ultimosDias.map((dia) => dia.valor);
        const datasets = [
            {
                label: monedaElegida,
                borderColor: "rgb(255, 99, 132)",
                data
            }
        ];
        return { labels, datasets };

    } catch (e) {
        error.innerHTML = e.message
    }
}

btnBuscar.addEventListener("click", () => {
    if (inputCantidad.value == "") {
        conversion.textContent = "Ingresa un dato válido"
        myChart.clear();
        return
    }
    if (inputCantidad.value < 0) {
        conversion.textContent = "Sólo puedes ingresar números positivos"
        return
    } 
    conversor(tipoMoneda.options[tipoMoneda.selectedIndex].value)  
})

