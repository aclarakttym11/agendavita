const API = 'http://localhost:3000';

// Elementos DOM
const authScreen = document.getElementById('authScreen');
const mainScreen = document.getElementById('mainScreen');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const consultaForm = document.getElementById('consultaForm');
const consultasDiv = document.getElementById('consultas');
const authTabs = document.querySelectorAll('.auth-tab');
const logoutBtn = document.getElementById('logoutBtn');
const userNameEl = document.getElementById('userName');
const userRoleEl = document.getElementById('userRole');
const dentistaSelect = document.getElementById('dentista');
const dentistaInfo = document.getElementById('dentistaInfo');
const dentistaDashboard = document.getElementById('dentistaDashboard');
const pacientesDoDiaDiv = document.getElementById('pacientesDoDia');
const dataDashboard = document.getElementById('dataDashboard');
const agendaSemanal = document.getElementById('agendaSemanal');
const consultasSemanaDiv = document.getElementById('consultasSemana');
const dataInicioSemana = document.getElementById('dataInicioSemana');
const dataFimSemana = document.getElementById('dataFimSemana');
const btnCarregarSemana = document.getElementById('btnCarregarSemana');
const disponibilidadeSection = document.getElementById('disponibilidadeSection');
const disponibilidadeForm = document.getElementById('disponibilidadeForm');
const listaDisponibilidade = document.getElementById('listaDisponibilidade');
const adminDisponibilidadeSection = document.getElementById('adminDisponibilidadeSection');
const adminDisponibilidadeForm = document.getElementById('adminDisponibilidadeForm');
const adminDentistaSelect = document.getElementById('adminDentistaSelect');
const listaDisponibilidadeAdmin = document.getElementById('listaDisponibilidadeAdmin');
const clienteDisponibilidadeSection = document.getElementById('clienteDisponibilidadeSection');
const listaDisponibilidadeCliente = document.getElementById('listaDisponibilidadeCliente');
const pacienteNome = document.getElementById('pacienteNome');
const pacienteGroup = document.getElementById('pacienteGroup');
const pacienteSelectGroup = document.getElementById('pacienteSelectGroup');
const pacienteSelect = document.getElementById('pacienteSelect');

console.log('Elementos DOM carregados:', {
    dentistaSelect,
    dentistaInfo,
    dentistaDashboard,
    pacientesDoDiaDiv,
    dataDashboard,
    agendaSemanal,
    consultasSemanaDiv,
    dataInicioSemana,
    dataFimSemana,
    btnCarregarSemana
});

// Verificar se usuário está logado
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (token && user.id) {
        showMainScreen(user);
    } else {
        showAuthScreen();
    }
}

// Mostrar tela de autenticação
function showAuthScreen() {
    authScreen.classList.remove('hidden');
    mainScreen.classList.add('hidden');
}

// Mostrar tela principal
function showMainScreen(user) {
    console.log('Mostrando tela principal para:', user);

    authScreen.classList.add('hidden');
    mainScreen.classList.remove('hidden');
    userNameEl.textContent = user.nome;
    userRoleEl.textContent = user.role === 'admin' ? 'Admin' : (user.role === 'dentista' ? 'Dentista' : 'Cliente');
    userRoleEl.className = `role-badge ${user.role}`;

    // Preencher nome do paciente no formulário de agendamento
    pacienteNome.value = user.nome;

    // Mostrar select de pacientes para admin
    if (user.role === 'admin') {
        pacienteSelectGroup.classList.remove('hidden');
        pacienteGroup.classList.add('hidden');
        carregarPacientes();
    }

    // Mostrar dashboard para dentistas
    if (user.role === 'dentista') {
        dentistaDashboard.classList.remove('hidden');
        dataDashboard.value = new Date().toISOString().split('T')[0];
        carregarPacientesDoDia();
    }

    // Mostrar agenda semanal para dentistas e admins
    if (user.role === 'dentista' || user.role === 'admin') {
        agendaSemanal.classList.remove('hidden');

        // Configurar datas da semana atual
        const hoje = new Date();
        const diaSemana = hoje.getDay();
        const inicioSemana = new Date(hoje.setDate(hoje.getDate() - diaSemana)).toISOString().split('T')[0];
        const fimSemana = new Date(hoje.setDate(hoje.getDate() - diaSemana + 6)).toISOString().split('T')[0];

        dataInicioSemana.value = inicioSemana;
        dataFimSemana.value = fimSemana;

        carregarConsultasSemana();
    }

    // Mostrar seção de disponibilidade para dentistas e admins
    if (user.role === 'dentista') {
        disponibilidadeSection.classList.remove('hidden');
        carregarDisponibilidade();
    } else if (user.role === 'admin') {
        adminDisponibilidadeSection.classList.remove('hidden');
        carregarDisponibilidadeAdmin();
        carregarDentistasParaAdmin();
    } else if (user.role === 'cliente') {
        clienteDisponibilidadeSection.classList.remove('hidden');
        carregarDisponibilidadeCliente();
    }

    console.log('Elemento dentistaSelect:', dentistaSelect);
    carregarDentistas();
    carregarConsultas();
}

// Carregar pacientes do dia para dentistas
async function carregarPacientesDoDia() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const data = dataDashboard.value;
    
    // Buscar dentista_id do usuário
    try {
        const dentistaResponse = await fetch(`${API}/dentistas`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const dentistaData = await dentistaResponse.json();
        
        if (dentistaData.sucesso && dentistaData.dentistas.length > 0) {
            // Encontrar o dentista associado ao usuário atual
            const dentista = dentistaData.dentistas.find(d => d.usuario_id === user.id);
            
            if (dentista) {
                const response = await fetch(`${API}/dentistas/${dentista.id}/pacientes-do-dia?data=${data}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                const dataResponse = await response.json();
                
                pacientesDoDiaDiv.innerHTML = '';
                
                if (dataResponse.sucesso && dataResponse.pacientes.length > 0) {
                    dataResponse.pacientes.forEach(paciente => {
                        pacientesDoDiaDiv.innerHTML += `
                            <div class="paciente-card">
                                <div class="paciente-header">
                                    <h3>${paciente.paciente_nome}</h3>
                                    <span class="badge ${getStatusClass(paciente.status)}">${getStatusText(paciente.status)}</span>
                                </div>
                                <div class="paciente-info">
                                    <p><strong>Horário:</strong> ${paciente.horario}</p>
                                    <p><strong>Tipo:</strong> ${formatTipoConsulta(paciente.tipo_consulta)}</p>
                                    ${paciente.paciente_email ? `<p><strong>Email:</strong> ${paciente.paciente_email}</p>` : ''}
                                    ${paciente.paciente_telefone ? `<p><strong>Telefone:</strong> ${paciente.paciente_telefone}</p>` : ''}
                                    ${paciente.observacoes ? `<p><strong>Observações:</strong> ${paciente.observacoes}</p>` : ''}
                                </div>
                            </div>
                        `;
                    });
                } else {
                    pacientesDoDiaDiv.innerHTML = '<p class="empty-message">Nenhum paciente agendado para esta data.</p>';
                }
            }
        }
    } catch (error) {
        console.error('Erro ao carregar pacientes do dia:', error);
        pacientesDoDiaDiv.innerHTML = '<p class="error-message">Erro ao carregar pacientes.</p>';
    }
}

// Event listener para mudança de data no dashboard
dataDashboard.addEventListener('change', carregarPacientesDoDia);

// Carregar consultas da semana para dentistas e admins
async function carregarConsultasSemana() {
    const token = localStorage.getItem('token');
    const dataInicio = dataInicioSemana.value;
    const dataFim = dataFimSemana.value;
    
    console.log('Carregando consultas da semana:', { dataInicio, dataFim });
    
    try {
        let url = `${API}/consultas/semana`;
        if (dataInicio && dataFim) {
            url += `?data_inicio=${dataInicio}&data_fim=${dataFim}`;
        }
        
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        
        console.log('Dados das consultas da semana:', data);
        
        consultasSemanaDiv.innerHTML = '';
        
        if (data.sucesso && data.consultas.length > 0) {
            data.consultas.forEach(consulta => {
                const statusClass = getStatusClass(consulta.status);
                const statusText = getStatusText(consulta.status);
                const dentistaNome = consulta.dentista_nome || 'Dentista não informado';
                const especialidade = consulta.dentista_especialidade ? `<span class="especialidade-badge-small">${consulta.dentista_especialidade}</span>` : '';
                const pacienteNome = consulta.paciente_nome || 'Paciente não informado';
                
                consultasSemanaDiv.innerHTML += `
                    <div class="consulta">
                        <div class="consulta-top">
                            <h3>${pacienteNome} - ${dentistaNome} ${especialidade}</h3>
                            <span class="badge ${statusClass}">${statusText}</span>
                        </div>
                        <div class="info">
                            <p><strong>Data:</strong> ${formatDate(consulta.data_consulta)}</p>
                            <p><strong>Horário:</strong> ${consulta.horario}</p>
                            <p><strong>Tipo:</strong> ${formatTipoConsulta(consulta.tipo_consulta)}</p>
                            ${consulta.observacoes ? `<p><strong>Observações:</strong> ${consulta.observacoes}</p>` : ''}
                        </div>
                    </div>
                `;
            });
        } else {
            consultasSemanaDiv.innerHTML = '<p class="empty-message">Nenhuma consulta agendada para este período.</p>';
        }
    } catch (error) {
        console.error('Erro ao carregar consultas da semana:', error);
        consultasSemanaDiv.innerHTML = '<p class="error-message">Erro ao carregar consultas.</p>';
    }
}

// Event listener para botão de buscar consultas da semana
btnCarregarSemana.addEventListener('click', carregarConsultasSemana);

// Carregar disponibilidade do dentista
async function carregarDisponibilidade() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    try {
        // Buscar dentista_id do usuário
        const dentistaResponse = await fetch(`${API}/dentistas`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const dentistaData = await dentistaResponse.json();

        if (dentistaData.sucesso && dentistaData.dentistas.length > 0) {
            const dentista = dentistaData.dentistas.find(d => d.usuario_id === user.id);

            if (dentista) {
                const response = await fetch(`${API}/disponibilidade/dentista/${dentista.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const data = await response.json();

                listaDisponibilidade.innerHTML = '';

                if (data.sucesso && data.disponibilidade.length > 0) {
                    data.disponibilidade.forEach(disp => {
                        listaDisponibilidade.innerHTML += `
                            <div class="disponibilidade-card">
                                <div class="disponibilidade-info">
                                    <p><strong>Dia:</strong> ${getDiaSemana(disp.dia_semana)}</p>
                                    <p><strong>Horário:</strong> ${disp.horario_inicio} às ${disp.horario_fim}</p>
                                </div>
                                <div class="disponibilidade-actions">
                                    <button class="edit-btn" onclick="editarDisponibilidade(${disp.id}, ${disp.dia_semana}, '${disp.horario_inicio}', '${disp.horario_fim}')">
                                        <i class="fa-solid fa-edit"></i>
                                    </button>
                                    <button class="delete-btn" onclick="deletarDisponibilidade(${disp.id})">
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        `;
                    });
                } else {
                    listaDisponibilidade.innerHTML = '<p class="empty-message">Nenhuma disponibilidade cadastrada.</p>';
                }
            }
        }
    } catch (error) {
        console.error('Erro ao carregar disponibilidade:', error);
        listaDisponibilidade.innerHTML = '<p class="error-message">Erro ao carregar disponibilidade.</p>';
    }
}

// Carregar disponibilidade para admin (visualização de todos os dentistas)
async function carregarDisponibilidadeAdmin() {
    const token = localStorage.getItem('token');

    try {
        const dentistaResponse = await fetch(`${API}/dentistas`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const dentistaData = await dentistaResponse.json();

        if (dentistaData.sucesso && dentistaData.dentistas.length > 0) {
            listaDisponibilidadeAdmin.innerHTML = '';

            for (const dentista of dentistaData.dentistas) {
                const response = await fetch(`${API}/disponibilidade/dentista/${dentista.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const data = await response.json();

                if (data.sucesso && data.disponibilidade.length > 0) {
                    listaDisponibilidadeAdmin.innerHTML += `
                        <h3 style="color: white; margin: 15px 0 10px 0;">${dentista.nome} - ${dentista.especialidade}</h3>
                    `;

                    data.disponibilidade.forEach(disp => {
                        listaDisponibilidadeAdmin.innerHTML += `
                            <div class="disponibilidade-card">
                                <div class="disponibilidade-info">
                                    <p><strong>Dia:</strong> ${getDiaSemana(disp.dia_semana)}</p>
                                    <p><strong>Horário:</strong> ${disp.horario_inicio} às ${disp.horario_fim}</p>
                                </div>
                                <div class="disponibilidade-actions">
                                    <button class="edit-btn" onclick="editarDisponibilidadeAdmin(${disp.id}, ${dentista.id}, ${disp.dia_semana}, '${disp.horario_inicio}', '${disp.horario_fim}')">
                                        <i class="fa-solid fa-edit"></i>
                                    </button>
                                    <button class="delete-btn" onclick="deletarDisponibilidade(${disp.id})">
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        `;
                    });
                }
            }

            if (listaDisponibilidadeAdmin.innerHTML === '') {
                listaDisponibilidadeAdmin.innerHTML = '<p class="empty-message">Nenhuma disponibilidade cadastrada pelos dentistas.</p>';
            }
        }
    } catch (error) {
        console.error('Erro ao carregar disponibilidade:', error);
        listaDisponibilidadeAdmin.innerHTML = '<p class="error-message">Erro ao carregar disponibilidade.</p>';
    }
}

// Carregar dentistas para o select do admin
async function carregarDentistasParaAdmin() {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${API}/dentistas`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        adminDentistaSelect.innerHTML = '<option value="">Selecione o dentista</option>';

        if (data.sucesso && data.dentistas.length > 0) {
            data.dentistas.forEach(dentista => {
                adminDentistaSelect.innerHTML += `
                    <option value="${dentista.id}">${dentista.nome} - ${dentista.especialidade}</option>
                `;
            });
        }
    } catch (error) {
        console.error('Erro ao carregar dentistas:', error);
    }
}

// Admin adicionar disponibilidade
adminDisponibilidadeForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    const dentista_id = adminDentistaSelect.value;
    const dia_semana = document.getElementById('adminDiaSemana').value;
    const horario_inicio = document.getElementById('adminHorarioInicio').value;
    const horario_fim = document.getElementById('adminHorarioFim').value;

    try {
        const response = await fetch(`${API}/disponibilidade`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                dentista_id: parseInt(dentista_id),
                dia_semana: parseInt(dia_semana),
                horario_inicio: horario_inicio,
                horario_fim: horario_fim
            })
        });

        const data = await response.json();

        if (data.sucesso) {
            alert('Disponibilidade adicionada com sucesso!');
            adminDisponibilidadeForm.reset();
            carregarDisponibilidadeAdmin();
        } else {
            alert(data.erro || 'Erro ao adicionar disponibilidade');
        }
    } catch (error) {
        alert('Erro ao conectar com o servidor');
    }
});

// Carregar disponibilidade para clientes
async function carregarDisponibilidadeCliente() {
    const token = localStorage.getItem('token');

    try {
        const dentistaResponse = await fetch(`${API}/dentistas`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const dentistaData = await dentistaResponse.json();

        listaDisponibilidadeCliente.innerHTML = '';

        if (dentistaData.sucesso && dentistaData.dentistas.length > 0) {
            for (const dentista of dentistaData.dentistas) {
                const response = await fetch(`${API}/disponibilidade/dentista/${dentista.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const data = await response.json();

                if (data.sucesso && data.disponibilidade.length > 0) {
                    listaDisponibilidadeCliente.innerHTML += `
                        <h3 style="color: white; margin: 15px 0 10px 0;">${dentista.nome} - ${dentista.especialidade}</h3>
                    `;

                    data.disponibilidade.forEach(disp => {
                        listaDisponibilidadeCliente.innerHTML += `
                            <div class="disponibilidade-card">
                                <div class="disponibilidade-info">
                                    <p><strong>Dia:</strong> ${getDiaSemana(disp.dia_semana)}</p>
                                    <p><strong>Horário:</strong> ${disp.horario_inicio} às ${disp.horario_fim}</p>
                                </div>
                            </div>
                        `;
                    });
                }
            }

            if (listaDisponibilidadeCliente.innerHTML === '') {
                listaDisponibilidadeCliente.innerHTML = '<p class="empty-message">Nenhuma disponibilidade cadastrada pelos dentistas.</p>';
            }
        }
    } catch (error) {
        console.error('Erro ao carregar disponibilidade:', error);
        listaDisponibilidadeCliente.innerHTML = '<p class="error-message">Erro ao carregar disponibilidade.</p>';
    }
}

// Criar disponibilidade
disponibilidadeForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const diaSemana = document.getElementById('diaSemana').value;
    const horarioInicio = document.getElementById('horarioInicio').value;
    const horarioFim = document.getElementById('horarioFim').value;

    try {
        // Buscar dentista_id do usuário
        const dentistaResponse = await fetch(`${API}/dentistas`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const dentistaData = await dentistaResponse.json();

        if (dentistaData.sucesso && dentistaData.dentistas.length > 0) {
            const dentista = dentistaData.dentistas.find(d => d.usuario_id === user.id);

            if (dentista) {
                const response = await fetch(`${API}/disponibilidade`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        dentista_id: dentista.id,
                        dia_semana: parseInt(diaSemana),
                        horario_inicio: horarioInicio,
                        horario_fim: horarioFim
                    })
                });

                const data = await response.json();

                if (data.sucesso) {
                    alert('Disponibilidade adicionada com sucesso!');
                    disponibilidadeForm.reset();
                    carregarDisponibilidade();
                } else {
                    alert(data.erro || 'Erro ao adicionar disponibilidade');
                }
            }
        }
    } catch (error) {
        alert('Erro ao conectar com o servidor');
    }
});

// Deletar disponibilidade
async function deletarDisponibilidade(id) {
    if (!confirm('Tem certeza que deseja excluir esta disponibilidade?')) return;

    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${API}/disponibilidade/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        if (data.sucesso) {
            alert(data.mensagem);
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user.role === 'admin') {
                carregarDisponibilidadeAdmin();
            } else {
                carregarDisponibilidade();
            }
        } else {
            alert(data.erro || 'Erro ao excluir disponibilidade');
        }
    } catch (error) {
        alert('Erro ao conectar com o servidor');
    }
}

// Editar disponibilidade (dentista)
async function editarDisponibilidade(id, dia_semana, horario_inicio, horario_fim) {
    const novoDia = prompt('Novo dia da semana (0=Domingo, 1=Segunda, ..., 6=Sábado):', dia_semana);
    if (novoDia === null) return;

    const novoInicio = prompt('Novo horário de início (HH:MM):', horario_inicio);
    if (novoInicio === null) return;

    const novoFim = prompt('Novo horário de fim (HH:MM):', horario_fim);
    if (novoFim === null) return;

    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${API}/disponibilidade/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                dia_semana: parseInt(novoDia),
                horario_inicio: novoInicio,
                horario_fim: novoFim,
                ativo: true
            })
        });

        const data = await response.json();

        if (data.sucesso) {
            alert('Disponibilidade atualizada com sucesso!');
            carregarDisponibilidade();
        } else {
            alert(data.erro || 'Erro ao atualizar disponibilidade');
        }
    } catch (error) {
        alert('Erro ao conectar com o servidor');
    }
}

// Editar disponibilidade (admin)
async function editarDisponibilidadeAdmin(id, dentista_id, dia_semana, horario_inicio, horario_fim) {
    const novoDia = prompt('Novo dia da semana (0=Domingo, 1=Segunda, ..., 6=Sábado):', dia_semana);
    if (novoDia === null) return;

    const novoInicio = prompt('Novo horário de início (HH:MM):', horario_inicio);
    if (novoInicio === null) return;

    const novoFim = prompt('Novo horário de fim (HH:MM):', horario_fim);
    if (novoFim === null) return;

    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${API}/disponibilidade/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                dia_semana: parseInt(novoDia),
                horario_inicio: novoInicio,
                horario_fim: novoFim,
                ativo: true
            })
        });

        const data = await response.json();

        if (data.sucesso) {
            alert('Disponibilidade atualizada com sucesso!');
            carregarDisponibilidadeAdmin();
        } else {
            alert(data.erro || 'Erro ao atualizar disponibilidade');
        }
    } catch (error) {
        alert('Erro ao conectar com o servidor');
    }
}

// Helper para obter nome do dia da semana
function getDiaSemana(dia) {
    const dias = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    return dias[dia];
}

// Carregar dentistas
async function carregarDentistas() {
    const token = localStorage.getItem('token');

    console.log('Carregando dentistas...');

    try {
        const response = await fetch(`${API}/dentistas`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        console.log('Dados dos dentistas:', data);

        dentistaSelect.innerHTML = '<option value="">Selecione o dentista</option>';

        if (data.sucesso && data.dentistas.length > 0) {
            data.dentistas.forEach(dentista => {
                dentistaSelect.innerHTML += `
                    <option value="${dentista.id}" data-especialidade="${dentista.especialidade}">
                        ${dentista.nome} - ${dentista.especialidade}
                    </option>
                `;
            });
            console.log('Dentistas carregados com sucesso');
        } else {
            console.log('Nenhum dentista encontrado');
        }
    } catch (error) {
        console.error('Erro ao carregar dentistas:', error);
    }
}

// Carregar pacientes para admin
async function carregarPacientes() {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${API}/auth/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        pacienteSelect.innerHTML = '<option value="">Selecione o paciente</option>';

        if (data.sucesso && data.usuarios) {
            data.usuarios.forEach(usuario => {
                if (usuario.role === 'cliente') {
                    pacienteSelect.innerHTML += `
                        <option value="${usuario.id}">
                            ${usuario.nome} ${usuario.telefone ? '(' + usuario.telefone + ')' : ''}
                        </option>
                    `;
                }
            });
        }
    } catch (error) {
        console.error('Erro ao carregar pacientes:', error);
    }
}

// Mostrar especialidade do dentista selecionado
dentistaSelect.addEventListener('change', () => {
    const selectedOption = dentistaSelect.options[dentistaSelect.selectedIndex];
    const especialidade = selectedOption.getAttribute('data-especialidade');
    
    if (especialidade) {
        dentistaInfo.innerHTML = `<span class="especialidade-badge"><i class="fa-solid fa-user-md"></i> ${especialidade}</span>`;
    } else {
        dentistaInfo.innerHTML = '';
    }
});

// Tabs de autenticação
authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        authTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const tabName = tab.dataset.tab;
        if (tabName === 'login') {
            loginForm.classList.remove('hidden');
            registerForm.classList.add('hidden');
        } else {
            loginForm.classList.add('hidden');
            registerForm.classList.remove('hidden');
        }
    });
});

// Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const senha = document.getElementById('loginSenha').value;
    
    try {
        const response = await fetch(`${API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });
        
        const data = await response.json();
        
        if (data.sucesso) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.usuario));
            showMainScreen(data.usuario);
            loginForm.reset();
        } else {
            alert(data.erro || 'Erro ao fazer login');
        }
    } catch (error) {
        alert('Erro ao conectar com o servidor');
    }
});

// Registro
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nome = document.getElementById('registerNome').value;
    const email = document.getElementById('registerEmail').value;
    const telefone = document.getElementById('registerTelefone').value;
    const senha = document.getElementById('registerSenha').value;
    const role = document.querySelector('input[name="role"]:checked').value;
    
    try {
        const response = await fetch(`${API}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, telefone, senha, role })
        });
        
        const data = await response.json();
        
        if (data.sucesso) {
            alert('Cadastro realizado com sucesso! Faça login para continuar.');
            registerForm.reset();
            authTabs[0].click();
        } else {
            alert(data.erro || 'Erro ao cadastrar');
        }
    } catch (error) {
        alert('Erro ao conectar com o servidor');
    }
});

// Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showAuthScreen();
});

// Criar consulta
consultaForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token) {
        alert('Você precisa estar logado para agendar uma consulta');
        return;
    }

    const paciente_id = user.role === 'admin' ? parseInt(pacienteSelect.value) : parseInt(user.id);
    const dentista_id = parseInt(document.getElementById('dentista').value);

    if (!paciente_id || isNaN(paciente_id)) {
        alert('Erro: ID do paciente inválido');
        return;
    }

    if (!dentista_id || isNaN(dentista_id)) {
        alert('Erro: Selecione um dentista');
        return;
    }

    const consulta = {
        paciente_id: paciente_id,
        dentista_id: dentista_id,
        data_consulta: document.getElementById('data').value,
        horario: document.getElementById('horario').value,
        tipo_consulta: document.getElementById('tipoConsulta').value,
        observacoes: document.getElementById('observacoes').value
    };

    try {
        const response = await fetch(`${API}/consultas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(consulta)
        });

        const data = await response.json();

        if (data.sucesso) {
            alert(data.mensagem);
            consultaForm.reset();
            dentistaInfo.innerHTML = '';
            carregarConsultas();
        } else {
            alert(data.erro || 'Erro ao agendar consulta');
        }
    } catch (error) {
        alert('Erro ao conectar com o servidor');
    }
});

// Carregar consultas
async function carregarConsultas() {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${API}/consultas`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        consultasDiv.innerHTML = '';

        if (data.sucesso && data.consultas && data.consultas.length > 0) {
            data.consultas.forEach(consulta => {
                const statusClass = getStatusClass(consulta.status);
                const statusText = getStatusText(consulta.status);
                const dentistaNome = consulta.dentista_nome || 'Dentista não informado';
                const pacienteNome = consulta.paciente_nome || 'Paciente não informado';
                const especialidade = consulta.dentista_especialidade ? `<span class="especialidade-badge-small">${consulta.dentista_especialidade}</span>` : '';

                consultasDiv.innerHTML += `
                    <div class="consulta">
                        <div class="consulta-top">
                            <h3>${pacienteNome} - ${dentistaNome} ${especialidade}</h3>
                            <span class="badge ${statusClass}">${statusText}</span>
                        </div>
                        <div class="info">
                            <p><strong>Tipo:</strong> ${formatTipoConsulta(consulta.tipo_consulta)}</p>
                            <p><strong>Data:</strong> ${formatDate(consulta.data_consulta)}</p>
                            <p><strong>Horário:</strong> ${consulta.horario}</p>
                            ${consulta.observacoes ? `<p><strong>Observações:</strong> ${consulta.observacoes}</p>` : ''}
                        </div>
                        <div class="consulta-actions">
                            <button class="status-btn" onclick="atualizarStatus(${consulta.id})">
                                <i class="fa-solid fa-sync"></i> Alterar Status
                            </button>
                            <button class="delete-btn" onclick="deletarConsulta(${consulta.id})">
                                <i class="fa-solid fa-trash"></i> Excluir
                            </button>
                        </div>
                    </div>
                `;
            });
        } else {
            consultasDiv.innerHTML = '<p class="empty-message">Nenhuma consulta agendada.</p>';
        }
    } catch (error) {
        consultasDiv.innerHTML = '<p class="error-message">Erro ao carregar consultas.</p>';
    }
}

// Deletar consulta
async function deletarConsulta(id) {
    if (!confirm('Tem certeza que deseja excluir esta consulta?')) return;

    const token = localStorage.getItem('token');

    if (!token) {
        alert('Você precisa estar logado para excluir uma consulta');
        return;
    }

    try {
        const response = await fetch(`${API}/consultas/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        if (data.sucesso) {
            alert(data.mensagem);
            carregarConsultas();
        } else {
            alert(data.erro || 'Erro ao excluir consulta');
        }
    } catch (error) {
        console.error('Erro ao excluir consulta:', error);
        alert('Erro ao conectar com o servidor');
    }
}

// Atualizar status
async function atualizarStatus(id) {
    const novoStatus = prompt('Novo status (agendada, concluída, cancelada):');

    if (!novoStatus || !['agendada', 'concluída', 'cancelada'].includes(novoStatus.toLowerCase())) {
        alert('Status inválido');
        return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
        alert('Você precisa estar logado para alterar o status');
        return;
    }

    try {
        const response = await fetch(`${API}/consultas/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: novoStatus.toLowerCase() })
        });

        const data = await response.json();

        if (data.sucesso) {
            alert(data.mensagem);
            carregarConsultas();
        } else {
            alert(data.erro || 'Erro ao atualizar status');
        }
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        alert('Erro ao conectar com o servidor');
    }
}

// Helpers
function getStatusClass(status) {
    switch(status) {
        case 'agendada': return 'agendada';
        case 'concluída': return 'concluida';
        case 'cancelada': return 'cancelada';
        default: return '';
    }
}

function getStatusText(status) {
    switch(status) {
        case 'agendada': return 'Agendada';
        case 'concluída': return 'Concluída';
        case 'cancelada': return 'Cancelada';
        default: return status;
    }
}

function formatTipoConsulta(tipo) {
    const tipos = {
        'limpeza': 'Limpeza',
        'restauracao': 'Restauração',
        'extracao': 'Extração',
        'canal': 'Tratamento de Canal',
        'ortodontia': 'Ortodontia',
        'implante': 'Implante',
        'avaliacao': 'Avaliação',
        'outro': 'Outro'
    };
    return tipos[tipo] || tipo;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
}

// Inicializar
checkAuth();