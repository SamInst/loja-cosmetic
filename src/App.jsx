import {
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { produtos } from "./data/produtos";

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
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );
  const [indiceImagemProduto, setIndiceImagemProduto] = useState({});
  const [imagemModal, setImagemModal] = useState(null);

  // (1) animação fly-to-cart
  const imgRefs = useRef({});
  const [cartBump, setCartBump] = useState(false);

  // (NEW) forma de pagamento + observação
  const [formaPagamento, setFormaPagamento] = useState("");
  const [observacao, setObservacao] = useState("");

  // (NEW) nome + cidade
  const [nomeCliente, setNomeCliente] = useState("");
  const [cidade, setCidade] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    mensagem +=
      "Seu pedido está quase lá!\n\nAguardando para fazer pagamento!";

    const telefone = "559870187296";
    const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  };

  // --- Controle de imagens múltiplas ---
  const trocarImagemProduto = (produtoId, delta, total) => {
    setIndiceImagemProduto((prev) => {
      const atual = prev[produtoId] ?? 0;
      const novo = (atual + delta + total) % total;
      return { ...prev, [produtoId]: novo };
    });
  };

  const abrirModalImagem = (produtoId, indice) => {
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

          <div
            style={{
              position: "relative",
              width: "80vw",
              maxWidth: 600,
              height: "60vh",
              maxHeight: 500,
              overflow: "hidden",
              borderRadius: 16,
              background: "#000",
            }}
          >
            <div
              style={{
                display: "flex",
                height: "100%",
                transform: `translateX(-${imagemModal.indice * 100}%)`,
                transition: "transform 0.45s ease",
              }}
            >
              {produtoModal.imagens.map((src, idx) => (
                <div
                  key={idx}
                  style={{
                    flex: "0 0 100%",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <img
                    src={src}
                    alt={produtoModal.nome}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                      display: "block",
                    }}
                  />
                </div>
              ))}
            </div>

            {produtoModal.imagens.length > 1 && (
              <>
                <button
                  style={{
                    position: "absolute",
                    left: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    borderRadius: "999px",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(15,23,42,0.75)",
                    color: "#fff",
                    boxShadow: "0 8px 20px rgba(15,23,42,0.6)",
                    backdropFilter: "blur(6px)",
                    cursor: "pointer",
                  }}
                  onClick={() => trocarImagemModal(-1)}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  style={{
                    position: "absolute",
                    right: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    borderRadius: "999px",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(15,23,42,0.75)",
                    color: "#fff",
                    boxShadow: "0 8px 20px rgba(15,23,42,0.6)",
                    backdropFilter: "blur(6px)",
                    cursor: "pointer",
                  }}
                  onClick={() => trocarImagemModal(1)}
                >
                  <ChevronRight size={20} />
                </button>

                <div
                  style={{
                    position: "absolute",
                    bottom: 14,
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    gap: 6,
                    zIndex: 5,
                  }}
                >
                  {produtoModal.imagens.map((_, idx) => (
                    <span
                      key={idx}
                      style={{
                        width: idx === imagemModal.indice ? 14 : 7,
                        height: 7,
                        borderRadius: 999,
                        background:
                          idx === imagemModal.indice
                            ? "#667eea"
                            : "rgba(255,255,255,0.75)",
                        boxShadow:
                          idx === imagemModal.indice
                            ? "0 0 0 1px rgba(255,255,255,0.5)"
                            : "none",
                        transition: "all 0.2s ease",
                      }}
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
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .products-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(250px, 1fr));
          gap: 20px;
        }
        @media (max-width: 900px) {
          .products-grid {
            grid-template-columns: repeat(2, minmax(220px, 1fr));
          }
        }
        @media (max-width: 600px) {
          .products-grid {
            grid-template-columns: repeat(2, minmax(150px, 1fr));
            gap: 12px;
          }
          .produto-media { height: 160px !important; }
          .produto-body { padding: 12px !important; }
          .produto-desc { font-size: 12px !important; -webkit-line-clamp: 2 !important; }
          .produto-price { font-size: 16px !important; }
          .add-btn { padding: 8px 12px !important; font-size: 13px !important; }
          .categoria-pill { font-size: 10px !important; padding: 3px 10px !important; }
        }
        @media (max-width: 380px) {
          .products-grid { grid-template-columns: repeat(2, minmax(140px, 1fr)); gap: 10px; }
          .produto-media { height: 145px !important; }
        }

        .produto-desc {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
          -webkit-line-clamp: 3;
        }

        .modal-bg {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
        }
        .modal-img-container {
          position: relative;
          background: transparent;
          padding: 30px 20px 20px 20px;
          border-radius: 16px;
          max-width: 95vw;
          max-height: 95vh;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .modal-close-btn {
          position: absolute;
          top: 10px;
          right: 12px;
          background: #fff;
          border: none;
          border-radius: 999px;
          font-size: 26px;
          font-weight: 800;
          cursor: pointer;
          z-index: 20;
          line-height: 1;
          width: 40px;
          height: 40px;
          display:flex;
          align-items:center;
          justify-content:center;
        }

        .cart-bump { animation: cartBump 280ms ease; }
        @keyframes cartBump {
          0% { transform: scale(1); }
          45% { transform: scale(1.06); }
          100% { transform: scale(1); }
        }
      `}</style>

      {renderModal()}

      <header
        style={{
          background: "white",
          padding: "15px 20px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 100,
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              color: "#2d3748",
              fontSize: "clamp(20px, 5vw, 28px)",
              fontWeight: "800",
              letterSpacing: "-0.5px",
            }}
          >
            ✨ CB Store
          </h1>
          <p
            style={{
              margin: "5px 0 0 0",
              color: "#718096",
              fontSize: "clamp(12px, 3vw, 14px)",
              fontWeight: "500",
            }}
          >
            Tudo em maquiagem e skincare para sua rotina de beleza!
          </p>
        </div>

        <button
          id="cart-button"
          className={cartBump ? "cart-bump" : ""}
          onClick={() => setMostrarCarrinho(!mostrarCarrinho)}
          style={{
            background: "#667eea",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "25px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
            fontWeight: "600",
            position: "relative",
            transition: "all 0.3s",
            whiteSpace: "nowrap",
          }}
        >
          <ShoppingCart size={18} />
          <span
            style={{
              display:
                typeof window !== "undefined" && window.innerWidth < 400
                  ? "none"
                  : "inline",
            }}
          >
            Carrinho
          </span>
          {quantidadeItens > 0 && (
            <span
              style={{
                background: "#f56565",
                borderRadius: "50%",
                width: "22px",
                height: "22px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: "bold",
                position: "absolute",
                top: "-5px",
                right: "-5px",
              }}
            >
              {quantidadeItens}
            </span>
          )}
        </button>
      </header>

      <div
        style={{
          padding: "20px",
          maxWidth: "1400px",
          margin: "0 auto",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {!mostrarCarrinho ? (
          <>
            <h2
              style={{
                color: "#2d3748",
                marginBottom: "30px",
                fontSize: "24px",
                fontWeight: "700",
                letterSpacing: "-0.5px",
              }}
            >
              Nossos Produtos
            </h2>

            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "15px",
                marginBottom: "20px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              }}
            >
              <div
                style={{ display: "flex", flexDirection: "column", gap: "15px" }}
              >
                <div style={{ width: "100%" }}>
                  <input
                    type="text"
                    placeholder="🔍 Buscar produtos..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 20px",
                      border: "2px solid #e2e8f0",
                      borderRadius: "10px",
                      fontSize: "16px",
                      outline: "none",
                      transition: "border 0.3s",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  />
                </div>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {categorias.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoriaFiltro(cat)}
                      style={{
                        background: categoriaFiltro === cat ? "#667eea" : "#e2e8f0",
                        color: categoriaFiltro === cat ? "white" : "#2d3748",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "20px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "600",
                        transition: "all 0.3s",
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <p
                style={{ margin: "15px 0 0 0", color: "#718096", fontSize: "14px" }}
              >
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

                return (
                  <div
                    key={produto.id}
                    style={{
                      background: "white",
                      borderRadius: "15px",
                      overflow: "hidden",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                      transition: "transform 0.3s, box-shadow 0.3s",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      maxWidth: "100%",
                      width: "100%",
                      position: "relative",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 25px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 15px rgba(0,0,0,0.1)";
                    }}
                  >
                    <div
                      className="produto-media"
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "280px",
                        overflow: "hidden",
                        backgroundColor: "#f7fafc",
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                        cursor: "pointer",
                      }}
                      onClick={() => abrirModalImagem(produto.id, indiceAtual)}
                    >
                      <div
                        style={{
                          display: "flex",
                          height: "100%",
                          transform: `translateX(-${indiceAtual * 100}%)`,
                          transition: "transform 0.45s ease",
                        }}
                      >
                        {produto.imagens.map((src, idx) => (
                          <div
                            key={idx}
                            style={{
                              flex: "0 0 100%",
                              width: "100%",
                              height: "100%",
                            }}
                          >
                            <img
                              src={src}
                              alt={produto.nome}
                              ref={(el) => {
                                if (idx === indiceAtual && el) {
                                  imgRefs.current[produto.id] = el;
                                }
                              }}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                objectPosition: "center",
                                display: "block",
                              }}
                            />
                          </div>
                        ))}
                      </div>

                      {totalImagens > 1 && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              trocarImagemProduto(produto.id, -1, totalImagens);
                            }}
                            style={{
                              position: "absolute",
                              left: "10px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              border: "none",
                              borderRadius: "999px",
                              width: "34px",
                              height: "34px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: "rgba(15,23,42,0.6)",
                              color: "#fff",
                              boxShadow: "0 8px 20px rgba(15,23,42,0.45)",
                              backdropFilter: "blur(6px)",
                              cursor: "pointer",
                            }}
                          >
                            <ChevronLeft size={18} />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              trocarImagemProduto(produto.id, 1, totalImagens);
                            }}
                            style={{
                              position: "absolute",
                              right: "10px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              border: "none",
                              borderRadius: "999px",
                              width: "34px",
                              height: "34px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: "rgba(15,23,42,0.6)",
                              color: "#fff",
                              boxShadow: "0 8px 20px rgba(15,23,42,0.45)",
                              backdropFilter: "blur(6px)",
                              cursor: "pointer",
                            }}
                          >
                            <ChevronRight size={18} />
                          </button>

                          <div
                            style={{
                              position: "absolute",
                              bottom: 10,
                              left: "50%",
                              transform: "translateX(-50%)",
                              display: "flex",
                              gap: 6,
                              zIndex: 5,
                            }}
                          >
                            {produto.imagens.map((_, idx) => (
                              <span
                                key={idx}
                                style={{
                                  width: idx === indiceAtual ? 14 : 7,
                                  height: 7,
                                  borderRadius: 999,
                                  background:
                                    idx === indiceAtual
                                      ? "#667eea"
                                      : "rgba(255,255,255,0.75)",
                                  boxShadow:
                                    idx === indiceAtual
                                      ? "0 0 0 1px rgba(255,255,255,0.5)"
                                      : "none",
                                  transition: "all 0.2s ease",
                                }}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    <div
                      className="produto-body"
                      style={{
                        padding: "15px",
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                          marginBottom: 8,
                        }}
                      >
                        <span
                          className="categoria-pill"
                          style={{
                            alignSelf: "flex-start",
                            background: "#edf2f7",
                            color: "#667eea",
                            padding: "4px 12px",
                            borderRadius: "12px",
                            fontSize: "11px",
                            fontWeight: "700",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {produto.categoria}
                        </span>
                        <h3
                          style={{
                            margin: 0,
                            color: "#2d3748",
                            fontSize: "16px",
                            lineHeight: "1.3",
                            fontWeight: "600",
                            letterSpacing: "-0.3px",
                          }}
                        >
                          {produto.nome}
                        </h3>
                      </div>

                      <p
                        className="produto-desc"
                        style={{
                          margin: "0 0 15px 0",
                          color: "#718096",
                          fontSize: "13px",
                          lineHeight: "1.5",
                          flex: 1,
                          fontWeight: "400",
                        }}
                      >
                        {produto.descricao}
                      </p>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: "auto",
                          paddingTop: "10px",
                          gap: "10px",
                          flexWrap: "wrap",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                          }}
                        >
                          {produto.promocao && produto.precoAntigo ? (
                            <span
                              style={{
                                fontSize: "14px",
                                color: "#a0aec0",
                                textDecoration: "line-through",
                              }}
                            >
                              R$ {produto.precoAntigo.toFixed(2)}
                            </span>
                          ) : null}

                          <span
                            className="produto-price"
                            style={{
                              fontSize: produto.promocao ? "22px" : "20px",
                              fontWeight: "bold",
                              color: produto.promocao ? "#f56565" : "#667eea",
                            }}
                          >
                            R$ {produto.preco.toFixed(2)}
                          </span>
                        </div>

                        <button
                          className="add-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            animarAdicaoAoCarrinho(produto.id);
                            adicionarAoCarrinho(produto);
                            bumpCart();
                          }}
                          style={{
                            background: "#48bb78",
                            color: "white",
                            border: "none",
                            padding: "10px 20px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: "600",
                            transition: "background 0.3s",
                            whiteSpace: "nowrap",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "#38a169")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "#48bb78")
                          }
                        >
                          Adicionar
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
            <h2
              style={{
                color: "#2d3748",
                marginBottom: "30px",
                fontSize: "24px",
                fontWeight: "700",
                letterSpacing: "-0.5px",
              }}
            >
              Meu Carrinho
            </h2>

            {carrinho.length === 0 ? (
              <div
                style={{
                  background: "white",
                  padding: "60px",
                  borderRadius: "15px",
                  textAlign: "center",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                }}
              >
                <ShoppingCart size={64} color="#cbd5e0" />
                <p
                  style={{
                    marginTop: "20px",
                    color: "#718096",
                    fontSize: "18px",
                  }}
                >
                  Seu carrinho está vazio
                </p>
                <button
                  onClick={() => setMostrarCarrinho(false)}
                  style={{
                    marginTop: "20px",
                    background: "#667eea",
                    color: "white",
                    border: "none",
                    padding: "12px 30px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "600",
                  }}
                >
                  Continuar comprando
                </button>
              </div>
            ) : (
              <>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: "20px" }}
                >
                  {carrinho.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        background: "white",
                        padding: "15px",
                        borderRadius: "15px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "12px",
                          minWidth: 0,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            minWidth: 0,
                            flex: 1,
                          }}
                        >
                          <div
                            style={{
                              minWidth: "60px",
                              maxWidth: "60px",
                              height: "60px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              position: "relative",
                            }}
                            onClick={() => abrirModalImagem(item.id, 0)}
                          >
                            <img
                              src={item.imagens[0]}
                              alt={item.nome}
                              style={{
                                width: "60px",
                                height: "60px",
                                objectFit: "cover",
                                objectPosition: "center",
                                borderRadius: "8px",
                              }}
                            />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              minWidth: 0,
                            }}
                          >
                            <h3
                              style={{
                                margin: "0 0 4px 0",
                                color: "#2d3748",
                                fontSize: "16px",
                                fontWeight: "600",
                                letterSpacing: "-0.3px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {item.nome}
                            </h3>
                            <p
                              style={{
                                margin: 0,
                                color: "#667eea",
                                fontSize: "14px",
                                fontWeight: "bold",
                              }}
                            >
                              R$ {item.preco.toFixed(2)} cada
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => removerDoCarrinho(item.id)}
                          style={{
                            background: "#fed7d7",
                            color: "#c53030",
                            border: "none",
                            width: "36px",
                            height: "36px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div
                        style={{
                          marginTop: "4px",
                          paddingTop: "10px",
                          borderTop: "1px solid #e2e8f0",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "10px",
                          flexWrap: "wrap",
                        }}
                      >
                        <div
                          style={{ display: "flex", alignItems: "center", gap: "10px" }}
                        >
                          <button
                            onClick={() => alterarQuantidade(item.id, -1)}
                            style={{
                              background: "#e2e8f0",
                              border: "none",
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Minus size={16} />
                          </button>

                          <span
                            style={{
                              fontSize: "16px",
                              fontWeight: "600",
                              minWidth: "25px",
                              textAlign: "center",
                            }}
                          >
                            {item.quantidade}
                          </span>

                          <button
                            onClick={() => alterarQuantidade(item.id, 1)}
                            style={{
                              background: "#e2e8f0",
                              border: "none",
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <span
                          style={{
                            fontSize: "18px",
                            fontWeight: "bold",
                            color: "#667eea",
                            whiteSpace: "nowrap",
                          }}
                        >
                          R$ {(item.preco * item.quantidade).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: "30px",
                    background: "white",
                    padding: "20px",
                    borderRadius: "15px",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                  }}
                >
                  {/* (NEW) nome + cidade */}
                  <div
                    style={{
                      marginBottom: "16px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      padding: "14px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <span style={{ fontSize: 16, fontWeight: 800, color: "#2d3748" }}>
                      Dados do cliente
                    </span>

                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#2d3748" }}>
                        Nome
                      </span>
                      <input
                        value={nomeCliente}
                        onChange={(e) => setNomeCliente(e.target.value)}
                        placeholder="Digite seu nome..."
                        style={{
                          width: "100%",
                          padding: "12px 14px",
                          borderRadius: "10px",
                          border: "2px solid #e2e8f0",
                          outline: "none",
                          fontSize: "14px",
                          color: "#2d3748",
                          background: "#fff",
                          boxSizing: "border-box",
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "#667eea")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
                      />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#2d3748" }}>
                        Cidade
                      </span>
                      <select
                        value={cidade}
                        onChange={(e) => setCidade(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px 14px",
                          borderRadius: "10px",
                          border: "2px solid #e2e8f0",
                          outline: "none",
                          fontSize: "15px",
                          fontWeight: 600,
                          color: "#2d3748",
                          background: "#fff",
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "#667eea")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
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

                  {/* (NEW) forma de pagamento + observação */}
                  <div
                    style={{
                      marginBottom: "16px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      padding: "14px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "16px",
                          fontWeight: "700",
                          color: "#2d3748",
                        }}
                      >
                        Forma de pagamento
                      </span>

                      {!formaPagamentoSelecionada ? (
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: "700",
                            color: "#c53030",
                            background: "#fed7d7",
                            padding: "6px 10px",
                            borderRadius: 999,
                          }}
                        >
                          Selecione para liberar o envio
                        </span>
                      ) : (
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: "700",
                            color: "#22543d",
                            background: "#c6f6d5",
                            padding: "6px 10px",
                            borderRadius: 999,
                          }}
                        >
                          Selecionado:{" "}
                          {FORMA_PAGAMENTO_LABEL[formaPagamento] || formaPagamento}
                        </span>
                      )}
                    </div>

                    <select
                      value={formaPagamento}
                      onChange={(e) => setFormaPagamento(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "10px",
                        border: "2px solid",
                        borderColor: formaPagamentoSelecionada ? "#c6f6d5" : "#fed7d7",
                        outline: "none",
                        fontSize: "15px",
                        fontWeight: 600,
                        color: "#2d3748",
                        background: "#fff",
                      }}
                    >
                      <option value="">Selecione...</option>
                      {Object.values(FORMA_PAGAMENTO).map((v) => (
                        <option key={v} value={v}>
                          {FORMA_PAGAMENTO_LABEL[v] || v}
                        </option>
                      ))}
                    </select>

                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#2d3748" }}>
                        Observação (opcional)
                      </span>
                      <textarea
                        value={observacao}
                        onChange={(e) => setObservacao(e.target.value)}
                        placeholder="Ex: entregar após 18h, trocar cor, informar troco para dinheiro..."
                        rows={3}
                        style={{
                          width: "100%",
                          resize: "vertical",
                          padding: "12px 14px",
                          borderRadius: "10px",
                          border: "2px solid #e2e8f0",
                          outline: "none",
                          fontSize: "14px",
                          lineHeight: 1.4,
                          color: "#2d3748",
                          background: "#fff",
                          boxSizing: "border-box",
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "#667eea")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "20px",
                      gap: "10px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "clamp(20px, 5vw, 24px)",
                        fontWeight: "700",
                        color: "#2d3748",
                        letterSpacing: "-0.5px",
                      }}
                    >
                      Total:
                    </span>
                    <span
                      style={{
                        fontSize: "clamp(24px, 6vw, 32px)",
                        fontWeight: "800",
                        color: "#667eea",
                        letterSpacing: "-1px",
                      }}
                    >
                      R$ {totalCarrinho.toFixed(2)}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      gap: "15px",
                    }}
                  >
                    <button
                      onClick={() => setMostrarCarrinho(false)}
                      style={{
                        flex: 1,
                        background: "#e2e8f0",
                        color: "#2d3748",
                        border: "none",
                        padding: "15px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "16px",
                        fontWeight: "600",
                      }}
                    >
                      Continuar comprando
                    </button>

                    {formaPagamentoSelecionada ? (
                      <button
                        onClick={finalizarCompra}
                        style={{
                          flex: 2,
                          background: "#48bb78",
                          color: "white",
                          border: "none",
                          padding: "15px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontSize: "16px",
                          fontWeight: "600",
                        }}
                      >
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
