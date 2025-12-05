import {
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import React, { useMemo, useRef, useState } from "react";
import { produtos } from "./data/produtos";
import "./css/cb-store.css";

const FORMA_PAGAMENTO = {
  PIX: "PIX",
  CARTAO_CREDITO: "CARTAO_CREDITO",
  CARTAO_DEBITO: "CARTAO_DEBITO",
};

const FORMA_PAGAMENTO_LABEL = {
  [FORMA_PAGAMENTO.PIX]: "Pix",
  [FORMA_PAGAMENTO.CARTAO_CREDITO]: "Cartão de crédito",
  [FORMA_PAGAMENTO.CARTAO_DEBITO]: "Cartão de débito",
};

const CIDADE = {
  CAJARI: "CAJARI",
  SAO_LUIS: "SAO_LUIS",
};

const CIDADE_LABEL = {
  [CIDADE.CAJARI]: "Cajari",
  [CIDADE.SAO_LUIS]: "São Luís",
};

export default function App() {
  const [carrinho, setCarrinho] = useState([]);
  const [mostrarCarrinho, setMostrarCarrinho] = useState(false);
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todos");
  const [busca, setBusca] = useState("");
  const [indiceImagemProduto, setIndiceImagemProduto] = useState({});
  const [imagemModal, setImagemModal] = useState(null);

  // animação fly-to-cart
  const imgRefs = useRef({});
  const [cartBump, setCartBump] = useState(false);

  // forma pagamento + observação
  const [formaPagamento, setFormaPagamento] = useState("");
  const [observacao, setObservacao] = useState("");

  // nome + cidade
  const [nomeCliente, setNomeCliente] = useState("");
  const [cidade, setCidade] = useState("");

  const bumpCart = () => {
    setCartBump(true);
    window.setTimeout(() => setCartBump(false), 280);
  };

  const animarAdicaoAoCarrinho = (produtoId) => {
    const imgEl = imgRefs.current[produtoId];
    const cartEl = document.getElementById("cart-button");
    if (!imgEl || !cartEl) return;

    const imgRect = imgEl.getBoundingClientRect();
    const cartRect = cartEl.getBoundingClientRect();

    const clone = imgEl.cloneNode(true);
    clone.style.position = "fixed";
    clone.style.left = `${imgRect.left}px`;
    clone.style.top = `${imgRect.top}px`;
    clone.style.width = `${imgRect.width}px`;
    clone.style.height = `${imgRect.height}px`;
    clone.style.objectFit = "cover";
    clone.style.borderRadius = "14px";
    clone.style.pointerEvents = "none";
    clone.style.zIndex = "99999";
    clone.style.boxShadow = "0 18px 40px rgba(15,23,42,0.25)";
    clone.style.transform = "translate(0px, 0px) scale(1)";
    clone.style.opacity = "0.95";
    clone.style.transition =
      "transform 650ms cubic-bezier(0.2, 0.9, 0.2, 1), opacity 650ms ease";

    document.body.appendChild(clone);

    const startX = imgRect.left + imgRect.width / 2;
    const startY = imgRect.top + imgRect.height / 2;
    const endX = cartRect.left + cartRect.width / 2;
    const endY = cartRect.top + cartRect.height / 2;

    const dx = endX - startX;
    const dy = endY - startY;

    requestAnimationFrame(() => {
      clone.style.transform = `translate(${dx}px, ${dy}px) scale(0.12)`;
      clone.style.opacity = "0";
    });

    clone.addEventListener(
      "transitionend",
      () => {
        clone.remove();
      },
      { once: true }
    );
  };

  const adicionarAoCarrinho = (produto) => {
    const itemExistente = carrinho.find((item) => item.id === produto.id);
    if (itemExistente) {
      setCarrinho(
        carrinho.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        )
      );
    } else {
      setCarrinho([...carrinho, { ...produto, quantidade: 1 }]);
    }
  };

  const tentarAdicionar = (produto) => {
    if (produto?.disponivel === false) return;
    animarAdicaoAoCarrinho(produto.id);
    adicionarAoCarrinho(produto);
    bumpCart();
  };

  const removerDoCarrinho = (id) => {
    setCarrinho(carrinho.filter((item) => item.id !== id));
  };

  const alterarQuantidade = (id, delta) => {
    setCarrinho(
      carrinho
        .map((item) => {
          if (item.id === id) {
            const novaQuantidade = item.quantidade + delta;
            return novaQuantidade > 0
              ? { ...item, quantidade: novaQuantidade }
              : item;
          }
          return item;
        })
        .filter((item) => item.quantidade > 0)
    );
  };

  const totalCarrinho = useMemo(
    () =>
      carrinho.reduce(
        (total, item) => total + item.preco * item.quantidade,
        0
      ),
    [carrinho]
  );

  const quantidadeItens = useMemo(
    () => carrinho.reduce((total, item) => total + item.quantidade, 0),
    [carrinho]
  );

  const categorias = useMemo(
    () => ["Todos", ...new Set(produtos.map((p) => p.categoria))],
    []
  );

  const produtosFiltrados = useMemo(() => {
    return produtos.filter((produto) => {
      const matchCategoria =
        categoriaFiltro === "Todos" || produto.categoria === categoriaFiltro;
      const matchBusca =
        produto.nome.toLowerCase().includes(busca.toLowerCase()) ||
        produto.descricao.toLowerCase().includes(busca.toLowerCase());
      return matchCategoria && matchBusca;
    });
  }, [categoriaFiltro, busca]);

  const finalizarCompra = () => {
    if (carrinho.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }
    // segurança: impede finalizar com itens indisponíveis
    const temIndisponivel = carrinho.some((p) => p.disponivel === false);
    if (temIndisponivel) {
      alert("Seu carrinho possui itens indisponíveis. Remova-os para continuar.");
      return;
    }
    if (!nomeCliente.trim()) {
      alert("Informe seu nome para continuar.");
      return;
    }
    if (!cidade) {
      alert("Selecione a cidade para continuar.");
      return;
    }
    if (!formaPagamento) {
      alert("Selecione a forma de pagamento para continuar.");
      return;
    }

    let mensagem = "*🛍️ Novo Pedido - CB Store*\n\n";

    mensagem += "*Cliente:*\n";
    mensagem += `- Nome: ${nomeCliente.trim()}\n`;
    mensagem += `- Cidade: ${CIDADE_LABEL[cidade] || cidade}\n\n`;

    mensagem += "*Forma de pagamento:*\n";
    mensagem += `- ${FORMA_PAGAMENTO_LABEL[formaPagamento] || formaPagamento}\n`;

    const obs = (observacao || "").trim();
    if (obs) {
      mensagem += `\n*Observação:*\n${obs}\n`;
    }

    mensagem += "\n*Produtos:*\n";

    carrinho.forEach((item, index) => {
      mensagem += `\n${index + 1}. *${item.nome}*\n`;
      mensagem += `   Quantidade: ${item.quantidade}\n`;
      mensagem += `   Preço unitário: R$ ${item.preco.toFixed(2)}\n`;
      mensagem += `   Subtotal: R$ ${(item.preco * item.quantidade).toFixed(2)}\n`;
    });

    mensagem += `\n*Total do Pedido: R$ ${totalCarrinho.toFixed(2)}*\n\n`;
    mensagem += "Seu pedido está quase lá!\n\nAguardando para fazer pagamento!";

    const telefone = "559870187296";
    const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  };

  // imagens múltiplas
  const trocarImagemProduto = (produtoId, delta, total) => {
    setIndiceImagemProduto((prev) => {
      const atual = prev[produtoId] ?? 0;
      const novo = (atual + delta + total) % total;
      return { ...prev, [produtoId]: novo };
    });
  };

  const abrirModalImagem = (produtoId, indice) => {
    const p = produtos.find((x) => x.id === produtoId);
    if (!p || p.disponivel === false) return; // ✅ bloqueia modal se indisponível
    setImagemModal({ produtoId, indice });
  };

  const trocarImagemModal = (delta) => {
    setImagemModal((prev) => {
      if (!prev) return prev;
      const produto = produtos.find((p) => p.id === prev.produtoId);
      if (!produto) return prev;
      const total = produto.imagens.length;
      const novoIndice = (prev.indice + delta + total) % total;
      return { ...prev, indice: novoIndice };
    });
  };

  const renderModal = () => {
    if (!imagemModal) return null;
    const produtoModal = produtos.find((p) => p.id === imagemModal.produtoId);
    if (!produtoModal) return null;

    // segurança extra
    if (produtoModal.disponivel === false) return null;

    return (
      <div className="modal-bg" onClick={() => setImagemModal(null)}>
        <div
          className="modal-img-container"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="modal-close-btn"
            onClick={() => setImagemModal(null)}
          >
            &times;
          </button>

          <div className="modal-viewbox">
            <div className="modal-track" style={{ "--idx": imagemModal.indice }}>
              {produtoModal.imagens.map((src, idx) => (
                <div key={idx} className="modal-slide">
                  <img src={src} alt={produtoModal.nome} className="modal-img" />
                </div>
              ))}
            </div>

            {produtoModal.imagens.length > 1 && (
              <>
                <button
                  className="modal-nav-btn left"
                  onClick={() => trocarImagemModal(-1)}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  className="modal-nav-btn right"
                  onClick={() => trocarImagemModal(1)}
                >
                  <ChevronRight size={20} />
                </button>

                <div className="modal-dots">
                  {produtoModal.imagens.map((_, idx) => (
                    <span
                      key={idx}
                      className={
                        "modal-dot " +
                        (idx === imagemModal.indice ? "is-active" : "")
                      }
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const formaPagamentoSelecionada = Boolean(formaPagamento);

  return (
    <div className="cb-app">
      {renderModal()}

      <header className="cb-header">
        <div>
          <h1 className="cb-brand-title">✨ CB Store</h1>
          <p className="cb-brand-subtitle">
            Tudo em maquiagem e skincare para sua rotina de beleza!
          </p>
        </div>

        <button
          id="cart-button"
          className={`cart-button ${cartBump ? "cart-bump" : ""}`}
          onClick={() => setMostrarCarrinho(!mostrarCarrinho)}
        >
          <ShoppingCart size={18} />
          <span className="cart-text">Carrinho</span>

          {quantidadeItens > 0 && (
            <span className="cart-badge">{quantidadeItens}</span>
          )}
        </button>
      </header>

      <div className="cb-container">
        {!mostrarCarrinho ? (
          <>
            <h2 className="page-title">Nossos Produtos</h2>

            <div className="card card-pad-20 filters">
              <div className="filters-stack">
                <div>
                  <input
                    type="text"
                    placeholder="🔍 Buscar produtos..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="input"
                  />
                </div>

                <div className="cat-row">
                  {categorias.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoriaFiltro(cat)}
                      className={`cat-btn ${
                        categoriaFiltro === cat ? "is-active" : ""
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <p className="filters-count">
                {produtosFiltrados.length}{" "}
                {produtosFiltrados.length === 1
                  ? "produto encontrado"
                  : "produtos encontrados"}
              </p>
            </div>

            <div className="products-grid">
              {produtosFiltrados.map((produto) => {
                const indiceAtual = indiceImagemProduto[produto.id] ?? 0;
                const totalImagens = produto.imagens.length;
                const indisponivel = produto.disponivel === false;

                return (
                  <div
                    key={produto.id}
                    className={`product-card ${indisponivel ? "is-disabled" : ""}`}
                    aria-disabled={indisponivel}
                  >
                    <div
                      className="produto-media"
                      onClick={() =>
                        !indisponivel && abrirModalImagem(produto.id, indiceAtual)
                      }
                      role="button"
                      tabIndex={0}
                    >
                      {indisponivel && (
                        <>
                          <div className="indisponivel-badge">⚠️ Indisponível</div>
                          <div className="indisponivel-strip">
                            Produto indisponível no momento
                          </div>
                        </>
                      )}

                      <div
                        className="carousel-track"
                        style={{ "--idx": indiceAtual }}
                      >
                        {produto.imagens.map((src, idx) => (
                          <div key={idx} className="carousel-slide">
                            <img
                              src={src}
                              alt={produto.nome}
                              ref={(el) => {
                                if (idx === indiceAtual && el) {
                                  imgRefs.current[produto.id] = el;
                                }
                              }}
                              className="produto-img"
                            />
                          </div>
                        ))}
                      </div>

                      {!indisponivel && totalImagens > 1 && (
                        <>
                          <button
                            className="media-nav-btn left"
                            onClick={(e) => {
                              e.stopPropagation();
                              trocarImagemProduto(produto.id, -1, totalImagens);
                            }}
                          >
                            <ChevronLeft size={18} />
                          </button>

                          <button
                            className="media-nav-btn right"
                            onClick={(e) => {
                              e.stopPropagation();
                              trocarImagemProduto(produto.id, 1, totalImagens);
                            }}
                          >
                            <ChevronRight size={18} />
                          </button>

                          <div className="dots">
                            {produto.imagens.map((_, idx) => (
                              <span
                                key={idx}
                                className={`dot ${
                                  idx === indiceAtual ? "is-active" : ""
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    <div className="produto-body">
                      <div className="produto-top">
                        <span className="categoria-pill">{produto.categoria}</span>
                        <h3 className="produto-nome">{produto.nome}</h3>
                      </div>

                      <p className="produto-desc">{produto.descricao}</p>

                      <div className="produto-bottom">
                        <div className="price-col">
                          {produto.promocao && produto.precoAntigo ? (
                            <span className="preco-antigo">
                              R$ {produto.precoAntigo.toFixed(2)}
                            </span>
                          ) : null}

                          <span
                            className={`produto-price ${
                              produto.promocao ? "is-promo" : ""
                            }`}
                          >
                            R$ {produto.preco.toFixed(2)}
                          </span>
                        </div>

                        <button
                          className={`add-btn ${indisponivel ? "is-disabled" : ""}`}
                          disabled={indisponivel}
                          onClick={(e) => {
                            e.stopPropagation();
                            tentarAdicionar(produto);
                          }}
                        >
                          {indisponivel ? "Indisponível" : "Adicionar"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div>
            <h2 className="page-title">Meu Carrinho</h2>

            {carrinho.length === 0 ? (
              <div className="card card-pad-60 card-center">
                <span className="empty-icon">
                  <ShoppingCart size={64} color="#cbd5e0" />
                </span>
                <p className="empty-text">Seu carrinho está vazio</p>
                <button
                  onClick={() => setMostrarCarrinho(false)}
                  className="btn-primary"
                >
                  Continuar comprando
                </button>
              </div>
            ) : (
              <>
                <div className="cart-list">
                  {carrinho.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-top">
                        <div className="cart-item-left">
                          <div
                            className="cart-thumb-wrap"
                            onClick={() => abrirModalImagem(item.id, 0)}
                          >
                            <img
                              src={item.imagens[0]}
                              alt={item.nome}
                              className="cart-thumb"
                            />
                          </div>

                          <div>
                            <h3 className="cart-item-title">{item.nome}</h3>
                            <p className="cart-item-unit">
                              R$ {item.preco.toFixed(2)} cada
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => removerDoCarrinho(item.id)}
                          className="remove-btn"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="cart-item-bottom">
                        <div className="qty-controls">
                          <button
                            onClick={() => alterarQuantidade(item.id, -1)}
                            className="qty-btn"
                          >
                            <Minus size={16} />
                          </button>

                          <span className="qty-value">{item.quantidade}</span>

                          <button
                            onClick={() => alterarQuantidade(item.id, 1)}
                            className="qty-btn"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <span className="cart-item-subtotal">
                          R$ {(item.preco * item.quantidade).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  {/* Dados do cliente */}
                  <div className="section-box">
                    <span className="section-title">Dados do cliente</span>

                    <div className="field-block">
                      <span className="field-label">Nome</span>
                      <input
                        value={nomeCliente}
                        onChange={(e) => setNomeCliente(e.target.value)}
                        placeholder="Digite seu nome..."
                        className="input-field"
                      />
                    </div>

                    <div className="field-block">
                      <span className="field-label">Cidade</span>
                      <select
                        value={cidade}
                        onChange={(e) => setCidade(e.target.value)}
                        className="select-field"
                      >
                        <option value="">Selecione...</option>
                        {Object.values(CIDADE).map((v) => (
                          <option key={v} value={v}>
                            {CIDADE_LABEL[v] || v}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Forma de pagamento */}
                  <div className="section-box">
                    <div className="payment-header">
                      <span className="section-title">Forma de pagamento</span>

                      {!formaPagamentoSelecionada ? (
                        <span className="badge-warn">
                          Selecione para liberar o envio
                        </span>
                      ) : (
                        <span className="badge-ok">
                          Selecionado:{" "}
                          {FORMA_PAGAMENTO_LABEL[formaPagamento] || formaPagamento}
                        </span>
                      )}
                    </div>

                    <select
                      value={formaPagamento}
                      onChange={(e) => setFormaPagamento(e.target.value)}
                      className={`select-field payment-select ${
                        formaPagamentoSelecionada ? "is-ok" : "is-warn"
                      }`}
                    >
                      <option value="">Selecione...</option>
                      {Object.values(FORMA_PAGAMENTO).map((v) => (
                        <option key={v} value={v}>
                          {FORMA_PAGAMENTO_LABEL[v] || v}
                        </option>
                      ))}
                    </select>

                    <div className="field-block">
                      <span className="field-label">Observação (opcional)</span>
                      <textarea
                        value={observacao}
                        onChange={(e) => setObservacao(e.target.value)}
                        placeholder="Ex: entregar após 18h, trocar cor, informar troco para dinheiro..."
                        rows={3}
                        className="textarea-field"
                      />
                    </div>
                  </div>

                  <div className="cart-total-row">
                    <span className="total-label">Total:</span>
                    <span className="total-value">
                      R$ {totalCarrinho.toFixed(2)}
                    </span>
                  </div>

                  <div className="cart-actions">
                    <button
                      onClick={() => setMostrarCarrinho(false)}
                      className="btn-muted"
                    >
                      Continuar comprando
                    </button>

                    {formaPagamentoSelecionada ? (
                      <button onClick={finalizarCompra} className="btn-success">
                        📱 Enviar Pedido por WhatsApp
                      </button>
                    ) : null}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
