import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';

const produtos = [
  {
    id: 1,
    nome: 'Hidratante Facial Vitamina C',
    preco: 89.90,
    precoAntigo: 129.90,
    promocao: true,
    descricao: 'Hidratante facial com vitamina C que ilumina e revitaliza a pele. Textura leve e rápida absorção.',
    categoria: 'Rosto',
    img: 'https://images.unsplash.com/photo-1556228852-80aa0a8a9e69?w=400&h=400&fit=crop&q=80'
  },
  {
    id: 2,
    nome: 'Sabonete Esfoliante Natural',
    preco: 35.90,
    promocao: false,
    descricao: 'Sabonete artesanal com microesferas naturais. Remove impurezas e células mortas suavemente.',
    categoria: 'Corpo',
    img: 'https://images.unsplash.com/photo-1585838139375-ca2e92d7484b?w=400&h=400&fit=crop&q=80'
  },
  {
    id: 3,
    nome: 'Kit Shampoo + Condicionador',
    preco: 119.90,
    precoAntigo: 159.90,
    promocao: true,
    descricao: 'Kit completo para cabelos danificados. Fórmula com óleo de argan e proteínas reparadoras.',
    categoria: 'Cabelo',
    img: 'https://images.unsplash.com/photo-1629198735754-8c9d19b93f3f?w=400&h=400&fit=crop&q=80'
  },
  {
    id: 4,
    nome: 'Sérum Anti-Idade',
    preco: 149.90,
    promocao: false,
    descricao: 'Sérum concentrado com ácido hialurônico e retinol. Reduz linhas finas e firmeza da pele.',
    categoria: 'Rosto',
    img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop&q=80'
  },
  {
    id: 5,
    nome: 'Máscara Facial Detox',
    preco: 65.90,
    promocao: false,
    descricao: 'Máscara de argila verde que purifica os poros e controla a oleosidade. Uso semanal.',
    categoria: 'Rosto',
    img: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=400&fit=crop&q=80'
  },
  {
    id: 6,
    nome: 'Óleo Corporal Relaxante',
    preco: 79.90,
    precoAntigo: 99.90,
    promocao: true,
    descricao: 'Óleo nutritivo com lavanda e camomila. Hidrata profundamente e promove relaxamento.',
    categoria: 'Corpo',
    img: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop&q=80'
  },
  {
    id: 7,
    nome: 'Protetor Solar FPS 60',
    preco: 95.90,
    promocao: false,
    descricao: 'Proteção solar de alta performance. Toque seco, resistente à água e sem oleosidade.',
    categoria: 'Rosto',
    img: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&q=80'
  },
  {
    id: 8,
    nome: 'Creme para as Mãos',
    preco: 42.90,
    promocao: false,
    descricao: 'Creme intensivo para mãos ressecadas. Fórmula com manteiga de karité e vitamina E.',
    categoria: 'Corpo',
    img: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&h=400&fit=crop&q=80'
  }
];

export default function App() {
  const [carrinho, setCarrinho] = useState([]);
  const [mostrarCarrinho, setMostrarCarrinho] = useState(false);
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todos');
  const [busca, setBusca] = useState('');

  const adicionarAoCarrinho = (produto) => {
    const itemExistente = carrinho.find(item => item.id === produto.id);
    
    if (itemExistente) {
      setCarrinho(carrinho.map(item =>
        item.id === produto.id
          ? { ...item, quantidade: item.quantidade + 1 }
          : item
      ));
    } else {
      setCarrinho([...carrinho, { ...produto, quantidade: 1 }]);
    }
  };

  const removerDoCarrinho = (id) => {
    setCarrinho(carrinho.filter(item => item.id !== id));
  };

  const alterarQuantidade = (id, delta) => {
    setCarrinho(carrinho.map(item => {
      if (item.id === id) {
        const novaQuantidade = item.quantidade + delta;
        return novaQuantidade > 0 ? { ...item, quantidade: novaQuantidade } : item;
      }
      return item;
    }).filter(item => item.quantidade > 0));
  };

  const totalCarrinho = carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  const quantidadeItens = carrinho.reduce((total, item) => total + item.quantidade, 0);

  const categorias = ['Todos', ...new Set(produtos.map(p => p.categoria))];

  const produtosFiltrados = produtos.filter(produto => {
    const matchCategoria = categoriaFiltro === 'Todos' || produto.categoria === categoriaFiltro;
    const matchBusca = produto.nome.toLowerCase().includes(busca.toLowerCase()) ||
                       produto.descricao.toLowerCase().includes(busca.toLowerCase());
    return matchCategoria && matchBusca;
  });

  const finalizarCompra = () => {
    if (carrinho.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }

    let mensagem = '*🛍️ Novo Pedido - Beauté Naturelle*\n\n';
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

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      `}</style>
      {/* Header */}
      <header style={{
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
      }}>
        <div>
          <h1 style={{ margin: 0, color: '#2d3748', fontSize: 'clamp(20px, 5vw, 28px)', fontWeight: '800', letterSpacing: '-0.5px' }}>✨ Beauté Naturelle</h1>
          <p style={{ margin: '5px 0 0 0', color: '#718096', fontSize: 'clamp(12px, 3vw, 14px)', fontWeight: '500' }}>Cosméticos naturais e sustentáveis</p>
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
          <span style={{ display: window.innerWidth < 400 ? 'none' : 'inline' }}>Carrinho</span>
          {quantidadeItens > 0 && (
            <span style={{
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
            }}>
              {quantidadeItens}
            </span>
          )}
        </button>
      </header>

      <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Produtos */}
        {!mostrarCarrinho ? (
          <>
            <h2 style={{ color: '#2d3748', marginBottom: '30px', fontSize: '24px', fontWeight: '700', letterSpacing: '-0.5px' }}>Nossos Produtos</h2>
            
            {/* Filtros e Busca */}
            <div style={{ 
              background: 'white', 
              padding: '20px', 
              borderRadius: '15px', 
              marginBottom: '20px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {/* Busca */}
                <div style={{ width: '100%' }}>
                  <input
                    type="text"
                    placeholder="🔍 Buscar produtos..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
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
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>

                {/* Filtro de Categorias */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {categorias.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategoriaFiltro(cat)}
                      style={{
                        background: categoriaFiltro === cat ? '#667eea' : '#e2e8f0',
                        color: categoriaFiltro === cat ? 'white' : '#2d3748',
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
              <p style={{ margin: '15px 0 0 0', color: '#718096', fontSize: '14px' }}>
                {produtosFiltrados.length} {produtosFiltrados.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
              gap: '20px'
            }}>
              {produtosFiltrados.map(produto => (
                <div key={produto.id} style={{
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
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                }}>
                  {/* Badge de Promoção */}
                  {produto.promocao && (
                    <div style={{
                      position: 'absolute',
                      top: '15px',
                      left: '15px',
                      background: '#f56565',
                      color: 'white',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '700',
                      zIndex: 10,
                      boxShadow: '0 2px 8px rgba(245,101,101,0.4)'
                    }}>
                      🔥 PROMOÇÃO
                    </div>
                  )}

                  <div style={{ 
                    position: 'relative', 
                    width: '100%', 
                    height: '280px',
                    overflow: 'hidden',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                  }}>
                    <img 
                      src={produto.img} 
                      alt={produto.nome}
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '100%', 
                        objectFit: 'contain',
                        objectPosition: 'center',
                        display: 'block'
                      }} 
                    />
                  </div>
                  
                  <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    {/* Categoria */}
                    <div style={{
                      display: 'inline-block',
                      background: '#edf2f7',
                      color: '#667eea',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '10px',
                      alignSelf: 'flex-start'
                    }}>
                      {produto.categoria}
                    </div>

                    <h3 style={{ margin: '0 0 10px 0', color: '#2d3748', fontSize: '16px', lineHeight: '1.3', fontWeight: '600', letterSpacing: '-0.3px' }}>
                      {produto.nome}
                    </h3>
                    <p style={{ margin: '0 0 15px 0', color: '#718096', fontSize: '13px', lineHeight: '1.5', flex: 1, fontWeight: '400' }}>
                      {produto.descricao}
                    </p>
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      marginTop: 'auto', 
                      paddingTop: '15px',
                      gap: '10px',
                      flexWrap: 'wrap'
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {produto.promocao && produto.precoAntigo && (
                          <span style={{ 
                            fontSize: '14px', 
                            color: '#a0aec0', 
                            textDecoration: 'line-through'
                          }}>
                            R$ {produto.precoAntigo.toFixed(2)}
                          </span>
                        )}
                        <span style={{ 
                          fontSize: produto.promocao ? '22px' : '20px', 
                          fontWeight: 'bold', 
                          color: produto.promocao ? '#f56565' : '#667eea'
                        }}>
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
                        onMouseEnter={(e) => e.currentTarget.style.background = '#38a169'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#48bb78'}
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Carrinho */
          <div>
            <h2 style={{ color: '#2d3748', marginBottom: '30px', fontSize: '24px', fontWeight: '700', letterSpacing: '-0.5px' }}>Meu Carrinho</h2>
            
            {carrinho.length === 0 ? (
              <div style={{
                background: 'white',
                padding: '60px',
                borderRadius: '15px',
                textAlign: 'center',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}>
                <ShoppingCart size={64} color="#cbd5e0" />
                <p style={{ marginTop: '20px', color: '#718096', fontSize: '18px' }}>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {carrinho.map(item => (
                    <div key={item.id} style={{
                      background: 'white',
                      padding: '15px',
                      borderRadius: '15px',
                      display: 'flex',
                      flexDirection: window.innerWidth < 768 ? 'column' : 'row',
                      gap: '15px',
                      alignItems: window.innerWidth < 768 ? 'stretch' : 'center',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                    }}>
                      <img 
                        src={item.img} 
                        alt={item.nome}
                        style={{ 
                          width: window.innerWidth < 768 ? '100%' : '100px', 
                          height: window.innerWidth < 768 ? 'auto' : '100px',
                          aspectRatio: '1/1',
                          objectFit: 'cover',
                          objectPosition: 'center',
                          borderRadius: '10px' 
                        }} 
                      />
                      
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: '0 0 5px 0', color: '#2d3748', fontSize: '16px', fontWeight: '600', letterSpacing: '-0.3px' }}>{item.nome}</h3>
                        <p style={{ margin: 0, color: '#718096', fontSize: '14px', fontWeight: '500' }}>
                          R$ {item.preco.toFixed(2)} cada
                        </p>
                      </div>
                      
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: window.innerWidth < 768 ? 'row' : 'row',
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        gap: '15px',
                        flexWrap: 'wrap'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                          <span style={{ fontSize: '16px', fontWeight: '600', minWidth: '25px', textAlign: 'center' }}>
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
                        
                        <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#667eea', minWidth: '80px', textAlign: 'center' }}>
                          R$ {(item.preco * item.quantidade).toFixed(2)}
                        </span>
                        
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
                            justifyContent: 'center'
                          }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div style={{
                  marginTop: '30px',
                  background: 'white',
                  padding: '20px',
                  borderRadius: '15px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: window.innerWidth < 768 ? 'column' : 'row',
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '20px',
                    gap: '10px'
                  }}>
                    <span style={{ fontSize: 'clamp(20px, 5vw, 24px)', fontWeight: '700', color: '#2d3748', letterSpacing: '-0.5px' }}>Total:</span>
                    <span style={{ fontSize: 'clamp(24px, 6vw, 32px)', fontWeight: '800', color: '#667eea', letterSpacing: '-1px' }}>
                      R$ {totalCarrinho.toFixed(2)}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row', gap: '15px' }}>
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
                      onClick={() => finalizarCompra()}
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