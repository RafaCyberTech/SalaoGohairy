(function () {
  var NUM = "258862996291";
  var $ = function (id) { return document.getElementById(id); };
  var nome = $("nome"), servico = $("servico"), morada = $("morada"), moradaBox = $("moradaBox"),
      data = $("data"), hora = $("hora"), obs = $("obs"), erro = $("erro"), previa = $("previa"), enviar = $("enviar");

  for (var h = 8; h <= 16; h++) {
    var t = (h < 10 ? "0" : "") + h + ":00";
    var o = document.createElement("option"); o.value = t; o.textContent = t.replace(":00", "h"); hora.appendChild(o);
  }
  hora.value = "09:00";

  function iso(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  var hoje = new Date();
  data.min = iso(hoje);
  var d0 = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1);
  if (d0.getDay() === 0) d0.setDate(d0.getDate() + 1);
  data.value = iso(d0);

  function parseData(v) { var p = v.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function dataBonita(v) {
    try { return parseData(v).toLocaleDateString("pt-PT", { weekday: "long", day: "numeric", month: "long", year: "numeric" }); }
    catch (e) { return v; }
  }
  function local() { return document.querySelector('input[name="local"]:checked').value; }

  function validar() {
    if (!nome.value.trim()) return "Escreva o seu nome.";
    if (local() === "Ao domicílio" && !morada.value.trim()) return "Indique o bairro ou uma referência da casa.";
    if (!data.value) return "Escolha o dia.";
    var d = parseData(data.value), h0 = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    if (d < h0) return "Escolha um dia a partir de hoje.";
    if (d.getDay() === 0) return "O salão fecha ao domingo. Escolha de segunda a sábado.";
    return "";
  }

  function mensagem() {
    var linhas = [
      "Olá! Gostaria de agendar um atendimento no salão Marcação de Cabelo.",
      "",
      "Nome: " + (nome.value.trim() || "..."),
      "Serviço: " + servico.value,
      "Local: " + local() + (local() === "Ao domicílio" && morada.value.trim() ? " (" + morada.value.trim() + ")" : ""),
      "Dia: " + (data.value ? dataBonita(data.value) : "..."),
      "Hora: " + hora.value.replace(":00", "h")
    ];
    if (obs.value.trim()) linhas.push("Observações: " + obs.value.trim());
    return linhas.join("\n");
  }

  function atualizar() {
    moradaBox.hidden = local() !== "Ao domicílio";
    var m = mensagem();
    previa.textContent = m;
    enviar.href = "https://wa.me/" + NUM + "?text=" + encodeURIComponent(m);
  }

  var form = $("form");
  form.addEventListener("input", function () { erro.textContent = ""; atualizar(); });
  form.addEventListener("change", atualizar);
  form.addEventListener("submit", function (e) { e.preventDefault(); });
  enviar.addEventListener("click", function (e) {
    var msg = validar();
    if (msg) { e.preventDefault(); erro.textContent = msg; }
  });

  Array.prototype.forEach.call(document.querySelectorAll("[data-pick]"), function (a) {
    a.addEventListener("click", function () { servico.value = a.getAttribute("data-pick"); atualizar(); });
  });

  function copiar(texto, alvo, estado, ok) {
    function falhou() {
      var r = document.createRange(); r.selectNodeContents(alvo);
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      estado.textContent = "Texto selecionado. Copie com o seu telemóvel.";
    }
    try {
      navigator.clipboard.writeText(texto).then(function () { estado.textContent = ok; }, falhou);
    } catch (e) { falhou(); }
  }
  $("copiarMsg").addEventListener("click", function () { copiar(mensagem(), previa, $("copiarEstado"), "Mensagem copiada."); });
  $("copiarNum").addEventListener("click", function () { copiar("+258 86 299 6291", $("numero"), $("numEstado"), "Número copiado."); });

  atualizar();
})();
