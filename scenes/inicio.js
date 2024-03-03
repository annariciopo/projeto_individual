// classe "inicio" é uma extenção do Phaser.Scene
class inicio extends Phaser.Scene {
    // contrutor da cena
    constructor() {
        // "chave de acesso" da cena
        super({ key: 'inicio'});
    }

    // carregando recursos
    preload() {
        // nome do jogo (pula moeda)
        this.load.image('nome', './assets/pulaMoeda.png');
        // botão jogar
        this.load.image('botao', './assets/botaoJogar.png');
        // instruções sobre o jogo
        this.load.image('instrucoes', './assets/instrucoes.png');
        // personagem
        this.load.image('personagem', './assets/personagem.png');
        // efeito de pulo
        this.load.image('pulo', './assets/efeito.png');
        // intrução sobre pular no botão jogar 
        this.load.image('instrucaoPular', './assets/pular.png');
    }

    // adicionando elementos 
    create() {

        // nome
        this.add.image(largura / 2, altura / 5, 'nome').setScale(0.7);
        // instruções
        this.add.image(largura / 2, altura / 2.3, 'instrucoes').setScale(0.6);
        // instruções sobre como começar o jogo
        this.add.image(largura / 2, altura / 1.6, 'instrucaoPular').setScale(0.6);

        // adicionando a imagem estática com física do botão
        botao =  this.physics.add.staticImage(largura / 2, altura / 1.4, 'botao');
        // definindo seu corpo de colisão
        botao.body.setSize(155, 55, true);
        // definindo sua escala
        botao.setScale(0.48);

        // adicionando a sprite com física do personagem
        personagem = this.physics.add.sprite(largura/2, 620, 'personagem')
        // definindo seu corpo de colisão
        personagem.body.setSize(150, 260, true)
        // definindo sua escala
        personagem.setScale(0.22);
        // adicionando colisão com as bordas do "mundo"
        personagem.setCollideWorldBounds(true);

        // criando a sprite do efeito
        pulo = this.add.sprite(0, 0, 'pulo');
        // tornando invisível
        pulo.setVisible(false);
        // definidno sua escala
        pulo.setScale(0.15);

        // impondo um valor para a variável "teclado"
        teclado = this.input.keyboard.createCursorKeys();

        // definindo a excução de tarefas após o personagem e o botao colidirem
        this.physics.add.overlap(personagem, botao, function(){
            // adicionando um à variável "pontosInicio"
            pontosInicio += 1;
        });

    }

    // atualizando elementos 
    update() {

        // movimento para esquerda
        if (teclado.left.isDown) {
            // velocidade
            personagem.setVelocityX(-150);
            // imagem inverte horizontalmente
            personagem.setFlip(true, false);
        }

        // movimento para a direita
        else if (teclado.right.isDown) {
            // velocidade
            personagem.setVelocityX(150);
            // imagem volta ao seu estado normal
            personagem.setFlip(false, false);
        }

        // sem movimento horizontal caso nenhuma das setas laterais estiver acionada
        else {
            personagem.setVelocityX(0);
        }

        // o personagem só poderá pular de novo
        const encostaChao = personagem.body.blocked.down || personagem.body.touching.down;
        // se o personagem estiver encostando no chão e a seta superior estiver ativada, o personagem irá pular
        if (encostaChao && teclado.up.isDown) {
            // define a velocidade do pulo
            personagem.setVelocityY(-370);
            // ativa a função "ativarPulo", que aciona o efeito 
            ativarPulo();
        }
        // se a seta inferior estiver acionada, o personagem irá descer
        else if (teclado.down.isDown){
            // velocidade de descida
            personagem.setVelocityY(300);
            // ativa a função "desativar Pulo", que tira o efeito
            desativarPulo();
        }
        // caso nada esteja sendo feito, a função "desativarPulo" estará ativada 
        else {
            desativarPulo();
        }

        // definindo a posição do efeito
        pulo.setPosition(personagem.x, personagem.y + 50);

        
        function ativarPulo() {
            // fazendo o efeito aparecer quando a função "ativarPulo" estiver ativada
            pulo.setVisible(true);
            // tornando a variável "tempoPulo" igual a 47
            tempoPulo = 47;
        }


        function desativarPulo() {
            // fazendo o efeito aparecer por mais tempo
            if (tempoPulo > 0){
                // subtraindo 1 da variável "tempoPulo" até se tornar igual a 0
                tempoPulo -= 1;
            }
            else{
                // fazendo o efeito desaparecer quando a função "desativarPulo" estiver ativada
                pulo.setVisible(false);
            }
        }

        // se o personagem encostar no botão escrito "jogar", se incia o jogo
        if (pontosInicio == 1){
                    this.scene.start('jogo');
        }

    }

       

}