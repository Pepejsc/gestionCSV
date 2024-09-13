document.addEventListener("DOMContentLoaded", function () {
    const files = [
        // Aquí podrías obtener dinámicamente la lista de archivos desde tu servidor
        { name: "Archivo1.csv", path: "../../data/access-code-password-recovery-code.csv" },
        { name: "Archivo2.csv", path: "../../data/clientes.csv" },
        { name: "Archivo3.csv", path: "../../data/grades.csv" }
    ];

    const fileList = document.getElementById('file-list');

    files.forEach(file => {
        const fileDiv = document.createElement('div');
        fileDiv.className = 'col-md-4';
        fileDiv.innerHTML = `
            <div class="card mb-4 shadow-sm">
                <img src="../../images/csv-icon.png" class="card-img-top" alt="Icono de archivo" style="width: 32px; height: 32px;">
                <div class="card-body">
                    <p class="card-text">${file.name}</p>
                    <button class="btn btn-primary visualizar-archivo-btn" data-file-path="${file.path}">Visualizar Archivo</button>
                </div>
            </div>
        `;
        fileList.appendChild(fileDiv);
    });

    // Agregar event listener para los botones de visualizar
    document.querySelectorAll('.visualizar-archivo-btn').forEach(button => {
        button.addEventListener('click', function () {
            const filePath = this.getAttribute('data-file-path');
            visualizarArchivo(filePath);
        });
    });
});

function visualizarArchivo(filePath) {
    // Guardar la ruta del archivo en localStorage para que la página principal pueda acceder a ella
    localStorage.setItem('filePath', filePath);
    // Redirigir a la página principal donde se visualizará el archivo
    window.location.href = '../../index.html';
}
