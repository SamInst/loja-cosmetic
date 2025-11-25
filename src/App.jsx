import {
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { produtos } from './data/produtos';

export default function App() {
  const [carrinho, setCarrinho] = useState([]);
  const [mostrarCarrinho, setMostrarCarrinho] = useState(false);
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todos');
  const [busca, setBusca] = useState('');
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  );
  const [indiceImagemProduto, setIndiceImagemProduto] = useState({});
  const [imagemModal, setImagemModal] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const adicionarAoCarrinho = (produto) => {
    const itemExistente = carrinho.find(item => item.id === produto.id);
    if (itemExistente) {
      setCarrinho(
        carrinho.map(item =>
          item.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item
        )
      );
    } else {
      setCarrinho([...carrinho, { ...produto, quantidade: 1 }]);
    }
  };

  const removerDoCarrinho = (id) => {
    setCarrinho(carrinho.filter(item => item.id !== id));
  };

  const alterarQuantidade = (id, delta) => {
    setCarrinho(
      carrinho
        .map(item => {
          if (item.id === id) {
            const novaQuantidade = item.quantidade + delta;
            return novaQuantidade > 0 ? { ...item, quantidade: novaQuantidade } : item;
          }
          return item;
        })
        .filter(item => item.quantidade > 0)
    );
  };

  const totalCarrinho = carrinho.reduce(
    (total, item) => total + item.preco * item.quantidade,
    0
  );
  const quantidadeItens = carrinho.reduce(
    (total, item) => total + item.quantidade,
    0
  );

  const categorias = ['Todos', ...new Set(produtos.map(p => p.categoria))];

  const produtosFiltrados = produtos.filter(produto => {
    const matchCategoria =
      categoriaFiltro === 'Todos' || produto.categoria === categoriaFiltro;
    const matchBusca =
      produto.nome.toLowerCase().includes(busca.toLowerCase()) ||
      produto.descricao.toLowerCase().includes(busca.toLowerCase());
    return matchCategoria && matchBusca;
  });

  const finalizarCompra = () => {
    if (carrinho.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }
    let mensagem = '*🛍️ Novo Pedido - Cielly Beauty*\n\n';
    mensagem += '*Produtos:*\n';

    carrinho.forEach((item, index) => {
      mensagem += `\n${index + 1}. *${item.nome}*\n`;
      mensagem += `   Quantidade: ${item.quantidade}\n`;
      mensagem += `   Preço unitário: R$ ${item.preco.toFixed(2)}\n`;
      mensagem += `   Subtotal: R$ ${(item.preco * item.quantidade).toFixed(2)}\n`;
    });

    mensagem += `\n*Total do Pedido: R$ ${totalCarrinho.toFixed(2)}*\n\n`;
    mensagem += '_Aguardo confirmação! 😊_';

    const telefone = '5598984508897';
    const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  };

  // --- Controle de imagens múltiplas ---

  const trocarImagemProduto = (produtoId, delta, total) => {
    setIndiceImagemProduto(prev => {
      const atual = prev[produtoId] ?? 0;
      const novo = (atual + delta + total) % total;
      return { ...prev, [produtoId]: novo };
    });
  };

  const abrirModalImagem = (produtoId, indice) => {
    setImagemModal({ produtoId, indice });
  };

  const trocarImagemModal = (delta) => {
    setImagemModal(prev => {
      if (!prev) return prev;
      const produto = produtos.find(p => p.id === prev.produtoId);
      if (!produto) return prev;
      const total = produto.imagens.length;
      const novoIndice = (prev.indice + delta + total) % total;
      return { ...prev, indice: novoIndice };
    });
  };

  const renderModal = () => {
    if (!imagemModal) return null;
    const produtoModal = produtos.find(p => p.id === imagemModal.produtoId);
    if (!produtoModal) return null;

    return (
      <div
        className="modal-bg"
        onClick={() => setImagemModal(null)}
      >
        <div
          className="modal-img-container"
          onClick={e => e.stopPropagation()}
        >
          <button
            className="modal-close-btn"
            onClick={() => setImagemModal(null)}
          >
            &times;
          </button>

          {/* SLIDER NO MODAL */}
          <div
            style={{
              position: 'relative',
              width: '80vw',
              maxWidth: 600,
              height: '60vh',
              maxHeight: 500,
              overflow: 'hidden',
              borderRadius: 16,
              background: '#000'
            }}
          >
            <div
              style={{
                display: 'flex',
                height: '100%',
                transform: `translateX(-${imagemModal.indice * 100}%)`,
                transition: 'transform 0.45s ease'
              }}
            >
              {produtoModal.imagens.map((src, idx) => (
                <div
                  key={idx}
                  style={{
                    flex: '0 0 100%',
                    width: '100%',
                    height: '100%'
                  }}
                >
                  <img
                    src={src}
                    alt={produtoModal.nome}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      display: 'block'
                    }}
                  />
                </div>
              ))}
            </div>

            {produtoModal.imagens.length > 1 && (
              <>
                <button
                  style={{
                    position: 'absolute',
                    left: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    border: 'none',
                    borderRadius: '999px',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(15,23,42,0.75)',
                    color: '#fff',
                    boxShadow: '0 8px 20px rgba(15,23,42,0.6)',
                    backdropFilter: 'blur(6px)',
                    cursor: 'pointer'
                  }}
                  onClick={() => trocarImagemModal(-1)}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  style={{
                    position: 'absolute',
                    right: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    border: 'none',
                    borderRadius: '999px',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(15,23,42,0.75)',
                    color: '#fff',
                    boxShadow: '0 8px 20px rgba(15,23,42,0.6)',
                    backdropFilter: 'blur(6px)',
                    cursor: 'pointer'
                  }}
                  onClick={() => trocarImagemModal(1)}
                >
                  <ChevronRight size={20} />
                </button>

                {/* bolinhas de indicação no modal */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 14,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: 6,
                    zIndex: 5
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
                            ? '#667eea'
                            : 'rgba(255,255,255,0.75)',
                        boxShadow:
                          idx === imagemModal.indice
                            ? '0 0 0 1px rgba(255,255,255,0.5)'
                            : 'none',
                        transition: 'all 0.2s ease'
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

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
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
            grid-template-columns: 1fr;
          }
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
        }
      `}</style>

      {renderModal()}

      {/* Header */}
      <header
        style={{
          background: 'white',
          padding: '15px 20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          flexWrap: 'wrap',
          gap: '10px'
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              color: '#2d3748',
              fontSize: 'clamp(20px, 5vw, 28px)',
              fontWeight: '800',
              letterSpacing: '-0.5px'
            }}
          >
            ✨ Cielly Beauty
          </h1>
          <p
            style={{
              margin: '5px 0 0 0',
              color: '#718096',
              fontSize: 'clamp(12px, 3vw, 14px)',
              fontWeight: '500'
            }}
          >
            Cosméticos naturais e sustentáveis
          </p>
        </div>
        <button
          onClick={() => setMostrarCarrinho(!mostrarCarrinho)}
          style={{
            background: '#667eea',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '25px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: '600',
            position: 'relative',
            transition: 'all 0.3s',
            whiteSpace: 'nowrap'
          }}
        >
          <ShoppingCart size={18} />
          <span
            style={{
              display:
                typeof window !== 'undefined' && window.innerWidth < 400
                  ? 'none'
                  : 'inline'
            }}
          >
            Carrinho
          </span>
          {quantidadeItens > 0 && (
            <span
              style={{
                background: '#f56565',
                borderRadius: '50%',
                width: '22px',
                height: '22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 'bold',
                position: 'absolute',
                top: '-5px',
                right: '-5px'
              }}
            >
              {quantidadeItens}
            </span>
          )}
        </button>
      </header>

      <div
        style={{
          padding: '20px',
          maxWidth: '1400px',
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        {/* Produtos */}
        {!mostrarCarrinho ? (
          <>
            <h2
              style={{
                color: '#2d3748',
                marginBottom: '30px',
                fontSize: '24px',
                fontWeight: '700',
                letterSpacing: '-0.5px'
              }}
            >
              Nossos Produtos
            </h2>

            {/* Filtros e Busca */}
            <div
              style={{
                background: 'white',
                padding: '20px',
                borderRadius: '15px',
                marginBottom: '20px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '15px'
                }}
              >
                {/* Busca */}
                <div style={{ width: '100%' }}>
                  <input
                    type="text"
                    placeholder="🔍 Buscar produtos..."
                    value={busca}
                    onChange={e => setBusca(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 20px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border 0.3s',
                      boxSizing: 'border-box'
                    }}
                    onFocus={e => (e.target.style.borderColor = '#667eea')}
                    onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
                  />
                </div>
                {/* Filtro de Categorias */}
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    flexWrap: 'wrap'
                  }}
                >
                  {categorias.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategoriaFiltro(cat)}
                      style={{
                        background:
                          categoriaFiltro === cat ? '#667eea' : '#e2e8f0',
                        color:
                          categoriaFiltro === cat ? 'white' : '#2d3748',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        transition: 'all 0.3s'
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              {/* Contador de resultados */}
              <p
                style={{
                  margin: '15px 0 0 0',
                  color: '#718096',
                  fontSize: '14px'
                }}
              >
                {produtosFiltrados.length}{' '}
                {produtosFiltrados.length === 1
                  ? 'produto encontrado'
                  : 'produtos encontrados'}
              </p>
            </div>

            <div className="products-grid">
              {produtosFiltrados.map(produto => {
                const indiceAtual = indiceImagemProduto[produto.id] ?? 0;
                const totalImagens = produto.imagens.length;

                return (
                  <div
                    key={produto.id}
                    style={{
                      background: 'white',
                      borderRadius: '15px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      maxWidth: '100%',
                      width: '100%',
                      position: 'relative'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow =
                        '0 8px 25px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow =
                        '0 4px 15px rgba(0,0,0,0.1)';
                    }}
                  >
                    {/* IMAGEM COM SLIDER (SEM DEGRADÊ) */}
                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: '280px',
                        overflow: 'hidden',
                        backgroundColor: '#f7fafc',
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                        cursor: 'pointer'
                      }}
                      onClick={() => abrirModalImagem(produto.id, indiceAtual)}
                    >
                      {/* trilho do slider */}
                      <div
                        style={{
                          display: 'flex',
                          height: '100%',
                          transform: `translateX(-${indiceAtual * 100}%)`,
                          transition: 'transform 0.45s ease'
                        }}
                      >
                        {produto.imagens.map((src, idx) => (
                          <div
                            key={idx}
                            style={{
                              flex: '0 0 100%',
                              width: '100%',
                              height: '100%'
                            }}
                          >
                            <img
                              src={src}
                              alt={produto.nome}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                objectPosition: 'center',
                                display: 'block'
                              }}
                            />
                          </div>
                        ))}
                      </div>

                      {/* botões de navegação */}
                      {totalImagens > 1 && (
                        <>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              trocarImagemProduto(produto.id, -1, totalImagens);
                            }}
                            style={{
                              position: 'absolute',
                              left: '10px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              border: 'none',
                              borderRadius: '999px',
                              width: '34px',
                              height: '34px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: 'rgba(15,23,42,0.6)',
                              color: '#fff',
                              boxShadow: '0 8px 20px rgba(15,23,42,0.45)',
                              backdropFilter: 'blur(6px)',
                              cursor: 'pointer'
                            }}
                          >
                            <ChevronLeft size={18} />
                          </button>

                          <button
                            onClick={e => {
                              e.stopPropagation();
                              trocarImagemProduto(produto.id, 1, totalImagens);
                            }}
                            style={{
                              position: 'absolute',
                              right: '10px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              border: 'none',
                              borderRadius: '999px',
                              width: '34px',
                              height: '34px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: 'rgba(15,23,42,0.6)',
                              color: '#fff',
                              boxShadow: '0 8px 20px rgba(15,23,42,0.45)',
                              backdropFilter: 'blur(6px)',
                              cursor: 'pointer'
                            }}
                          >
                            <ChevronRight size={18} />
                          </button>

                          {/* bolinhas de indicação */}
                          <div
                            style={{
                              position: 'absolute',
                              bottom: 10,
                              left: '50%',
                              transform: 'translateX(-50%)',
                              display: 'flex',
                              gap: 6,
                              zIndex: 5
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
                                      ? '#667eea'
                                      : 'rgba(255,255,255,0.75)',
                                  boxShadow:
                                    idx === indiceAtual
                                      ? '0 0 0 1px rgba(255,255,255,0.5)'
                                      : 'none',
                                  transition: 'all 0.2s ease'
                                }}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* CONTEÚDO DO CARD (categoria, nome, descrição, preço) */}
                    <div
                      style={{
                        padding: '15px',
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1
                      }}
                    >
                      {/* categoria + nome */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 6,
                          marginBottom: 8
                        }}
                      >
                        <span
                          style={{
                            alignSelf: 'flex-start',
                            background: '#edf2f7',
                            color: '#667eea',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}
                        >
                          {produto.categoria}
                        </span>
                        <h3
                          style={{
                            margin: 0,
                            color: '#2d3748',
                            fontSize: '16px',
                            lineHeight: '1.3',
                            fontWeight: '600',
                            letterSpacing: '-0.3px'
                          }}
                        >
                          {produto.nome}
                        </h3>
                      </div>

                      <p
                        style={{
                          margin: '0 0 15px 0',
                          color: '#718096',
                          fontSize: '13px',
                          lineHeight: '1.5',
                          flex: 1,
                          fontWeight: '400'
                        }}
                      >
                        {produto.descricao}
                      </p>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginTop: 'auto',
                          paddingTop: '10px',
                          gap: '10px',
                          flexWrap: 'wrap'
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px'
                          }}
                        >
                          {produto.promocao && produto.precoAntigo && (
                            <span
                              style={{
                                fontSize: '14px',
                                color: '#a0aec0',
                                textDecoration: 'line-through'
                              }}
                            >
                              R$ {produto.precoAntigo.toFixed(2)}
                            </span>
                          )}
                          <span
                            style={{
                              fontSize: produto.promocao ? '22px' : '20px',
                              fontWeight: 'bold',
                              color: produto.promocao ? '#f56565' : '#667eea'
                            }}
                          >
                            R$ {produto.preco.toFixed(2)}
                          </span>
                        </div>
                        <button
                          onClick={() => adicionarAoCarrinho(produto)}
                          style={{
                            background: '#48bb78',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            transition: 'background 0.3s',
                            whiteSpace: 'nowrap'
                          }}
                          onMouseEnter={e =>
                            (e.currentTarget.style.background = '#38a169')
                          }
                          onMouseLeave={e =>
                            (e.currentTarget.style.background = '#48bb78')
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
          /* Carrinho */
          <div>
            <h2
              style={{
                color: '#2d3748',
                marginBottom: '30px',
                fontSize: '24px',
                fontWeight: '700',
                letterSpacing: '-0.5px'
              }}
            >
              Meu Carrinho
            </h2>

            {carrinho.length === 0 ? (
              <div
                style={{
                  background: 'white',
                  padding: '60px',
                  borderRadius: '15px',
                  textAlign: 'center',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                }}
              >
                <ShoppingCart size={64} color="#cbd5e0" />
                <p
                  style={{
                    marginTop: '20px',
                    color: '#718096',
                    fontSize: '18px'
                  }}
                >
                  Seu carrinho está vazio
                </p>
                <button
                  onClick={() => setMostrarCarrinho(false)}
                  style={{
                    marginTop: '20px',
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    padding: '12px 30px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}
                >
                  Continuar comprando
                </button>
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                  }}
                >
                  {carrinho.map(item => (
                    <div
                      key={item.id}
                      style={{
                        background: 'white',
                        padding: '15px',
                        borderRadius: '15px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                      }}
                    >
                      {/* TOPO: imagem + textos à esquerda, remover à direita */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                          minWidth: 0
                        }}
                      >
                        {/* bloco imagem + nome + preço */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            minWidth: 0,
                            flex: 1
                          }}
                        >
                          <div
                            style={{
                              minWidth: '60px',
                              maxWidth: '60px',
                              height: '60px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              position: 'relative'
                            }}
                            onClick={() => abrirModalImagem(item.id, 0)}
                          >
                            <img
                              src={item.imagens[0]}
                              alt={item.nome}
                              style={{
                                width: '60px',
                                height: '60px',
                                objectFit: 'cover',
                                objectPosition: 'center',
                                borderRadius: '8px'
                              }}
                            />
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              minWidth: 0
                            }}
                          >
                            <h3
                              style={{
                                margin: '0 0 4px 0',
                                color: '#2d3748',
                                fontSize: '16px',
                                fontWeight: '600',
                                letterSpacing: '-0.3px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {item.nome}
                            </h3>
                            <p
                              style={{
                                margin: 0,
                                color: '#667eea',
                                fontSize: '14px',
                                fontWeight: 'bold'
                              }}
                            >
                              R$ {item.preco.toFixed(2)} cada
                            </p>
                          </div>
                        </div>

                        {/* botão remover à direita do nome/produto */}
                        <button
                          onClick={() => removerDoCarrinho(item.id)}
                          style={{
                            background: '#fed7d7',
                            color: '#c53030',
                            border: 'none',
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      {/* LINHA INFERIOR: quantidade à esquerda, total à direita */}
                      <div
                        style={{
                          marginTop: '4px',
                          paddingTop: '10px',
                          borderTop: '1px solid #e2e8f0',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '10px',
                          flexWrap: 'wrap'
                        }}
                      >
                        {/* Esquerda: botões e quantidade */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                          }}
                        >
                          <button
                            onClick={() => alterarQuantidade(item.id, -1)}
                            style={{
                              background: '#e2e8f0',
                              border: 'none',
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Minus size={16} />
                          </button>

                          <span
                            style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              minWidth: '25px',
                              textAlign: 'center'
                            }}
                          >
                            {item.quantidade}
                          </span>

                          <button
                            onClick={() => alterarQuantidade(item.id, 1)}
                            style={{
                              background: '#e2e8f0',
                              border: 'none',
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        {/* Direita: total */}
                        <span
                          style={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                            color: '#667eea',
                            whiteSpace: 'nowrap'
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
                    marginTop: '30px',
                    background: 'white',
                    padding: '20px',
                    borderRadius: '15px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: isMobile ? 'column' : 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '20px',
                      gap: '10px'
                    }}
                  >
                    <span
                      style={{
                        fontSize: 'clamp(20px, 5vw, 24px)',
                        fontWeight: '700',
                        color: '#2d3748',
                        letterSpacing: '-0.5px'
                      }}
                    >
                      Total:
                    </span>
                    <span
                      style={{
                        fontSize: 'clamp(24px, 6vw, 32px)',
                        fontWeight: '800',
                        color: '#667eea',
                        letterSpacing: '-1px'
                      }}
                    >
                      R$ {totalCarrinho.toFixed(2)}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: isMobile ? 'column' : 'row',
                      gap: '15px'
                    }}
                  >
                    <button
                      onClick={() => setMostrarCarrinho(false)}
                      style={{
                        flex: 1,
                        background: '#e2e8f0',
                        color: '#2d3748',
                        border: 'none',
                        padding: '15px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '600'
                      }}
                    >
                      Continuar comprando
                    </button>
                    <button
                      onClick={finalizarCompra}
                      style={{
                        flex: 2,
                        background: '#48bb78',
                        color: 'white',
                        border: 'none',
                        padding: '15px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '600'
                      }}
                    >
                      📱 Enviar Pedido por WhatsApp
                    </button>
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
