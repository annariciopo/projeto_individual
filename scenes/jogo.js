class jogo extends Phaser.Scene {
    constructor() {
        super({ key: 'jogo',
        backgroundColor: '#000',
    });
    }

    // carregando recursos
    preload() {
        // cenário
        this.load.image('bg', './assets/bg.png');
        // plataformas
        this.load.image('plataforma', './assets/plataforma.png');
        // personagem
        this.load.image('personagem', './assets/personagem.png');
        // efeito ao pular
        this.load.image('pulo', './assets/efeito.png');
        // moeda
        this.load.image('moeda', './assets/moeda.png')
    }

    // criando os elementos
    create() {

        // adicionando o cenário
        this.add.image(largura/2, altura/2, 'bg').setScale(1.4);

        // impondo um valor para a variável "teclado"
        teclado = this.input.keyboard.createCursorKeys();

        // personagem

        // adicionando sprite com física
        personagem = this.physics.add.sprite(largura/2, 630, 'personagem')
        // definindo o tamanho do corpo de colisão
        personagem.body.setSize(150, 260, true)
        // escala da sprite
        personagem.setScale(0.22);
        // colide com as bordas do mundo
        personagem.setCollideWorldBounds(true);

        // moeda

        // adicionando a sprite com física
        moeda = this.physics.add.sprite(455, 420, 'moeda');
        // definindo o tamanho do corpo de colisão
        moeda.body.setSize(480, 600, true);
        // escala da sprite 
        moeda.setScale(0.08);
        // faz a moeda "pingar"
        moeda.setBounce(0.7);

        // formatação do placar
        placar = this.add.text(25, 30, 'Moedas:' + pontos, {fontSize:'25px', fill:'#ffffff'});

        // definindo a excução de tarefas após o personagem e a moeda colidirem
        this.physics.add.overlap(personagem, moeda, function(){
            // 1. moeda fica invisível
            moeda.setVisible(false);
            
            // sorteio de um número entre 1 e 3, sendo sorteado novamente caso seja igual ao anterior
            while (sorteioVerificar == sorteio){
                sorteio = Phaser.Math.RND.between(1,3); 
            }
            sorteioVerificar = sorteio;
            
            // caso o resultado do sorteio seja 1, a moeda irá uma cima plataforma da direita
            if (sorteio == 1) {
                posicaoMoedaX = 455;
                posicaoMoedaY = 420;
            }
            // caso o resultado do sorteio seja 2, a moeda irá uma cima plataforma do meio
            else if (sorteio == 2) {
                posicaoMoedaX = 250;
                posicaoMoedaY = 265;
            }
            // caso o resultado do sorteio seja 3, a moeda irá uma cima plataforma da esquerda
            else if (sorteio == 3) {
                posicaoMoedaX = 45;
                posicaoMoedaY = 110;
            }
            
            // após o sorteio, a moeda irá para a posição definida
            moeda.setPosition( posicaoMoedaX,  posicaoMoedaY);
            // quando a personagem e a moeda colidirem, a pontuação aumenta um
            pontos += 1;
            // definindo o que estará escrito no placar 
            placar.setText('Moedas:' + pontos);
            // moeda volta a aparecer 
            moeda.setVisible(true);

        });

        // criando a sprite do turbo
        pulo = this.add.sprite(0, 0, 'pulo');
        pulo.setVisible(false);
        pulo.setScale(0.15);

        
        // plataforma 1 (direita)
        plataformas[0] = this.physics.add.staticImage(455, 520, 'plataforma');
        // tamanho do corpo de colisão
        plataformas[0].body.setSize(90, 25, true);
        // escala
        plataformas[0].setScale(0.18);
        // adicionando colisão com o personagem
        this.physics.add.collider(personagem, plataformas[0]);
        // adicionando colisão com a moeda
        this.physics.add.collider(moeda, plataformas[0]);


        // plataforma 2 (meio)
        plataformas[1] = this.physics.add.staticImage(250, 365, 'plataforma');
        // tamanho do corpo de colisão
        plataformas[1].body.setSize(90, 25, true);
        // escala
        plataformas[1].setScale(0.18);
        // adicionando colisão com o personagem
        this.physics.add.collider(personagem, plataformas[1]);
        // adicionando colisão com a moeda
        this.physics.add.collider(moeda, plataformas[1]);

        // plataforma 3 (esquerda)
        plataformas[2] = this.physics.add.staticImage(45, 210, 'plataforma');
        // tamanho do corpo de colisão
        plataformas[2].body.setSize(90, 25, true);
        // escala
        plataformas[2].setScale(0.18);
        // adicionando colisão com o personagem
        this.physics.add.collider(personagem, plataformas[2]);
        // adicionando colisão com a moeda
        this.physics.add.collider(moeda, plataformas[2]);

    }

    // atualizando os elementos 
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

    }
    


}