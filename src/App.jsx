function App() {
  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <h1>Haaskausvahti</h1>
      <p>Paljasta julkisen rahan hukka. Kerro epäkohdista. Tue tutkivaa journalismia.</p>
      <button style={{
        backgroundColor: '#0054A6',
        color: 'white',
        padding: '1rem 2rem',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        cursor: 'pointer',
        marginTop: '1rem'
      }}>
        Ilmoita hukasta
      </button>
    </div>
  );
}

export default App;
