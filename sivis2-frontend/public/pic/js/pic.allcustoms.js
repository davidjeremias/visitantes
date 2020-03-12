/* Início de novo arquivo concatenado */
(function () {/* Utils */
/**
 * __PIC__ é um namespace disponível globalmente que agrupa propriedades e métodos úteis para o desenvolvedor.
 * @namespace PIC
 * @property {string} version - O número de versão do PIC.
 */
;(function (PIC, $) {

    'use strict';
    var VERSION = '1.3.1',
        widgets = [],
        widgetsMap = {},
        widgetInstanceId = 0,
        WidgetHelper;

    PIC.version = VERSION;

    /*
     * Funções de teste de largura de tela
     * (associadas ao grid resposivo do Bootstrap)
     */

    /**
     * Verifica se a largura da tela está dentro da faixa XS do Bootstrap.
     * @function
     * @memberof PIC
     * @param width {number} Largura da tela a ser testada.
     * @returns {boolean}
     */
    PIC.isXS = function (width) {
        return (width < 768);
    };

    /**
     * Verifica se a largura da tela está dentro da faixa SM (mas acima da faixa XS) do Bootstrap.
     * @function
     * @memberof PIC
     * @param width {number} Largura da tela a ser testada.
     * @returns {boolean}
     */
    PIC.isSM = function (width) {
        return (width >= 768 && width < 992);
    };

    /**
     * Verifica se a largura da tela está dentro da faixa MD (mas acima da faixa SM) do Bootstrap.
     * @function
     * @memberof PIC
     * @param width {number} Largura da tela a ser testada.
     * @returns {boolean}
     */
    PIC.isMD = function (width) {
        return (width >= 992 && width < 1200);
    };

    /**
     * Verifica se a largura da tela está dentro da faixa LG (mas acima da faixa MD) do Bootstrap.
     *
     * Na prática, como LG não tem um limite máximo, verifica apenas se está acima da faixa MD.
     * @function
     * @memberof PIC
     * @param width {number} Largura da tela a ser testada.
     * @returns {boolean}
     */
    PIC.isLG = function (width) {
        return (width >= 1200);
    };

    /**
     * Verifica se o botão (button ou input) submete, por padrão, um formulário.
     *
     * A resposta é dada de acordo com as especificações do HTML para o atributo `type` desses controles.
     *
     * Veja a página [Botões que submetem formulários](http://sptdes/wiki/Bot%C3%B5es_que_submetem_um_formul%C3%A1rio_HTML) para mais detalhes
     *
     * @function
     * @memberof PIC
     * @param element {(Selector|Element|jQuery)} Botão que será testado pela função
     * @returns {boolean}
     */
    PIC.isSubmitButton = function (element) {
        var button = $(element);

        // button que não tenha type=reset nem type=submit
        if ( button.is('button') && !button.is('button[type=reset]') && !button.is('button[type=button]') ) {
            return true;
        }
        // input com type=submit ou type=image
        else if (button.is('input[type=submit]') || button.is('input[type=image]')) {
            return true;
        }
        // Qualquer outro caso não é botão de submissão.
        return false;
    };

    // Faz toggle no atribute, ex. $(seletor).toggleAttr('tabindex', 'novo valor', 'valor corrente');
    $.fn.toggleAttr = function(attr, attr1, attr2) {
        return this.each(function() {
          var self = $(this);
          if (self.attr(attr) == attr1)
            self.attr(attr, attr2);
          else
            self.attr(attr, attr1);
        });
      };

    /*
     * Verifica, por meio do nome, se o widget está registrado no PIC.
     * Retorna true se estiver registrado, false caso contrário.
     */
    var isWidgetRegistered = function (name) {
        return widgetsMap[name] !== undefined;
    };

    /*
     * Pega as opções informadas para um widget do PIC
     * Lê o valor do atributo data-pic-name (onde name é o nome do widget) do element, que
     * é o elemento-base do widget.
     * Retorna um objeto JSON contendo as opções
     * Se não houver opções, ou valor do atributo não for um JSON bem formado,
     * retorna um objeto vazio.
     */
    var getAttrOptions = function (element, name) {

        var attrOptions = {},
            jsonString;

        // Busca o string contido como valor do atributo data-pic-nomedowidget
        jsonString = element.attr('data-pic-' + name.toLowerCase());

        // Somente se alguma opção tiver sido informada.
        if (jsonString) {

            // O string JSON informado pelo utilizador do widget, contendo os parâmetros, pode não ser um JSON válido
            try {
                attrOptions = $.parseJSON(jsonString);

            } catch (exception) {

                console.error('Erro ao obter parâmetros do widget "' + name + '" para o elemento ', element, '\n' +
                              'Os parâmetros informados serão ignorados.\n' +
                              'String JSON mal formado: ', jsonString, '\n' +
                              'Exceção: ', exception);
            }
        }
        return attrOptions;
    };

    /*
     * Reúne as opções vindas de todas as fontes possíveis para o widget
     * Em detalhes, o que a função faz é reunir as opções definidas a) como padrão para o widget;
     * b) via atributo da tag html; c) via instanciação direta por jQuery. Para cada opção,
     * os valors em (c) tem precedência sobre (b), que tem preferência sobre (a).
     * Parâmetros:
     * - element é o elemento base da instância do widget.
     * - name é o nome do widget, que compõe o nome do atributo (data-pic-name)
     * - options (opcional) são as opções recebidas via instanciação direta por jQuery, sem o uso
     *   das funções auxiliares do PIC. Por exemplo: $('#meuItem').picMeuWidget( jsonOpcoes )
     * - defaults (opcional) são os valores default definidos para as opções do widget
     * - domains (opcional) são os domínios correspondentes a cada uma das opções
     */
    var collectOptions = function (element, name, options, defaults, domains) {

        var attrOptions;

        attrOptions = getAttrOptions (element, name);

        options = $.extend(false, {}, defaults, attrOptions, options);

        if ($.type(domains) === 'object' && !$.isEmptyObject(domains)) {
            $.each(domains, function (key) {

                if ($.inArray (options[key], this) === -1) {
                    // options[key] = defaults[key];
                    throw ('O valor informado para o parâmetro "' + key + '" é inválido. ' +
                           'Foi informado: ' + options[key]);
                }
            });
        }
        return options;
    };

    /*
     * Para um JSON em forma de string ou número, transforma em um JSON em forma de objeto.
     * Nesse objeto, a chave é o string ou número, e o valor é sempre true.
     *   'nofilter' >>> { nofilter: true }
     *   123        >>> { 123: true }
     * Para um JSON em forma de array, trata cada posição desse array como um JSON isolado,
     * e faz o mesmo tratamento (ou seja: transforma string e número em objeto; se a posição
     * contiver um array, trata essa posição recursivamente).
     * Para um JSON em qualquer outra forma, não faz nada.
     * O retorno da função pode ser:
     * - um JSON no formato objeto;
     * - um JSON no formato array, cada posição contendo um objeto ou array (que segue essa mesma regra, recursivamente)
     * Veja as formas possíveis de um JSON em http://www.json.org/
     */
    var objectify = function (json) {

        var result;

        // Verifique em que formato está o JSON recebido
        switch ($.type(json)) {

            case 'string':
            case 'number':
                // Transformação "direta" de um string ou número em objeto.
                // 'json' é a chave, e o valor é 'true'.
                result = {};
                result[json] = true;
                break;

            case 'array':
                result = [];
                // Para cada posição de 'json', faz a transformação recursivamente, e grava
                // o resultado na posição equivalente do result.
                $.each(json, function (index) {

                    result[index] = objectify (json[index]);
                });
                break;

            // Se o json recebido não é string, número ou array, não há nada a fazer.
            default:
                result = json;
                break;
        }
        return result;
    };


    /*
     * Transforma um objeto "options" no string correspondente.
     * Caso haja algum problema na conversão, ou o objeto não possa ser representado em forma
     * de string, retorna um string vazio.
     */
    var optionsObjectToString = function (options) {
        // Verifica se options é um json válido.
        // Pode haver erro aqui se for informado algo que não um json válido
        try {
            options = JSON.stringify(options);
            options = options || '';
        }
        catch (exception) {

            console.warn('Erro ao transformar options em um string JSON. Os parâmetros serão ignorados.\n' +
                         'O valor informado em options não pode ser convertido em um JSON: ', options, '\n' +
                         'Exceção: ', exception);
            options = '';
        }
        return options;
    };

    /*
     * Para cada elemento interno de uma instância de widget (element) que possua um atributo
     * de configuração, obtém essa configuração, transforma valores simples em objetos,
     * e associa o valor da configuração ao elemento configurado.
     * Transforma (por exemplo):
     * - data-pic-widget-config='nosort' em {nosort: true}
     * - data-pic-widget-config='["nosort", "nofilter"]' em [{nosort: true}, {nofilter: true}]
     * - data-pic-widget-config='{"validate" : "notBlank"}' já é um objeto,
     * O objeto é gravado com o nome picWidgetConfig (onde Widget é o nome do widget ao qual
     * a configuração se refere). Por exemplo: picValidationConfig.
     */
    var buildConfigObjects = function (element, name) {

        // Para cada elemento desse widget que possua configuração
        element.find('[data-pic-' + name.toLowerCase() + '-config]').each(function () {

            var config;

            // Obtém o conteúdo do atributo data-pic-widget-config
            config = $(this).attr('data-pic-' + name.toLowerCase() + '-config');

            // Se o valor informado contém apenas letras, considera como uma configuração
            // que é um string simples (ex: data-pic-datatable-options='nofilter')
            // Nesse caso, envolve o string com aspas duplas, para ser um JSON válido.
            if (/^[a-z]+$/i.test(config)) {
                config = '"' + config + '"';
            }

            try {

                config = $.parseJSON(config);

                // Se não for um objeto, config tem que ser transformado em um.
                // Isso torna o objeto de configuração mais genérico, e é o formato esperado
                // pela extensão do jQuery .filterByConfig().
                if ($.type(config) !== 'object') {

                    config = objectify(config);
                }

                // Associa o objeto de configuração gerado ao elemento configurado.
                $(this).config(name, config);

            } catch (exception) {

                console.error('Erro ao obter configuração relativa ao widget "' + name + '" para o elemento ', $(this), '\n' +
                              'A configuração será ignorada.\n' +
                              'String JSON mal formado: ', config, '\n' +
                              'Exceção: ', exception);
            }
        });
    };

    var unbuildConfigObjects = function (element, name) {

        // Para cada elemento desse widget que possua configuração
        element.find('[data-pic-' + name.toLowerCase() + '-config]').each(function () {

            $(this).removeConfig(name);
        });
    };

    /*
     * Com base no nome do widget e no contexto em que ele será aplicado, retorna a lista
     * de elementos em que o widget pode ser ativado
     * - name: Nome do widget, conforme registro no PIC (obrigatório)
     * - context: Elemento do documento a partir do qual a busca será feita (opcional)
     *            O próprio context é incluído na busca
     *            Pode ser informado em forma da seletor, elemento DOM ou objeto jQuery
     * - force: Usado para ativar widgets sem a marca data-pic-nomedowidget.
     *          Nesse caso, considera o context como elemento onde o widget será ativado.
     */
    var getElementsToActivate = function (name, context, force) {

        var elements,
            selector = '[data-pic-' + name.toLowerCase() + ']';

        if (force) {
            // Se está forçando a ativação, desconsidera o nome do widget e considera que o
            // valor passado para context corresponde ao elemento onde o widget será instanciado.
            elements = $(context);
        }
        else if (!context) {
            // Se o contexto não foi informado, pega todos os elementos (do documento) que
            // casem com o  seletor data-pic-<widget>
            elements = $(selector);
        }
        else {
            // Se o contexto foi informado, busca todos os elementos a partir de context
            // (inclusive ele mesmo, daí o uso do addBack()), que casem com
            // o selector data-pic-<widget>
            elements = $(context).find(selector).addBack().filter(selector);
        }
        // Em todo caso, não pode retornar elementos que já tenham sido ativados.
        elements = elements.not('[data-pic-active]');

        return elements;
    };

    /*
     * Com base no nome do widget e no contexto em que ele será destruído, retorna a lista
     * de elementos nos quais o widget será destruído.
     * - name: Nome do widget, conforme registro no PIC (obrigatório)
     * - context: Elemento do documento a partir do qual a busca será feita (opcional).
     *            O próprio context é incluído na busca.
     *            Pode ser informado em forma da seletor, elemento DOM ou objeto jQuery.
     * - force: Usado para destruir widgets que tenham sido ativados sem a marca data-pic-nomedowidget.
     *          Nesse caso, considera o context como elemento de onde o widget será destruído.
     */
    var getElementsToDestroy = function (name, context, force) {

        var elements,
            selector = '[data-pic-' + name.toLowerCase() + ']';

        if (force) {
            // Se está forçando o destroy, desconsidera o nome do widget e considera que o
            // valor passado para context corresponde ao elemento onde o widget foi instanciado.
            // Filtra para retornar apenas se tenha sido ativado no modo force,
            // Caso em que o atributo data-pic-active possui valor igual ao nome do widget.
            elements = $(context).filter('[data-pic-active=' + name + ']');
        }
        else if (!context) {
            // Se o contexto não foi informado, pega todos os elementos (do documento) que
            // casem com o  seletor data-pic-<widget>
            elements = $(selector);
        }
        else {
            // Se o contexto foi informado, busca todos os elementos a partir de context
            // (inclusive ele mesmo, daí o uso do addBack()), que casem com
            // o selector data-pic-<widget>
            elements = $(context).find(selector).addBack().filter(selector);
        }
        // Em todo caso, pode retornar apenas elementos que tenham sido ativados.
        elements = elements.filter('[data-pic-active]');

        return elements;
    };

    /*
     * Prepara efetivamente os elementos, incluindo o atributo e respectivo valor no DOM
     */
    var prepare = function (name, elements, options) {
        // Insere atributo e valor (options) nos elementos.
        // Como é a mesma ação para todos, faz "em lote".
        elements.attr('data-pic-' + name.toLowerCase(), options);

        // Percorre o conjunto apenas para poder informar as ações feitas.
        $.each(elements, function (index, element) {
            console.info('"' + name + '" preparado para o elemento', $(element));
        });
    };

    var activate = function (name, elements, options, force) {

        var activeAttr = 'data-pic-active',
            object,
            Widget = widgetsMap[name],
            dataObjName = 'pic' + name + 'Obj';

        // Tenta ativar o widget para cada element
        $.each(elements, function (index, element) {

            var widgetHelper;

            element = $(element);

            // A instanciação está sujeita a erros em tempo de execução por ser um processo genérico.
            try {
                // Cria os objetos de configuração dos elementos internos.
                buildConfigObjects(element, name);
                // Instancia os objetos
                widgetHelper = new WidgetHelper(Widget.prototype, element, options);
                object = new Widget(widgetHelper);
                // Guarda a referência ao método destroy fora do objeto,
                // para que não se confunda com a API pública do widget
                element.data('destroy', object.destroy);
                // Remove o método destroy do objeto
                delete object.destroy;
                // Guarda referência do objeto no element
                element.data(dataObjName, object);
            }
            catch (exception) {

                console.error('Erro ao criar instância do widget "' + name + '" para o elemento ', element, ': ', exception);

                if (exception.stack) {
                    console.debug(exception.stack);
                } else {
                    console.info('Utilize um navegador mais moderno para visualizar a pilha de exceção.');
                }
                return;
            }
            // Marca do fim da ativação
            // Se for uma ativação forçada, guarda o nome do widget como valor do atributo de ativação.
            element.attr(activeAttr, force ? name : '');
            // Avisa sobre a ativação
            console.info('"' + name + '" ativado para o elemento', element);
        });
    };

    var destroy = function (name, elements) {

        var activeAttr = 'data-pic-active',
            dataObjName = 'pic' + name + 'Obj';

        // Tenta destruir o widget para cada element
        $.each(elements, function (index, element) {

            element = $(element);
            // Destrói o objeto
            element.data('destroy')();
            // Destruir os objetos de configuração dos elementos internos.
            unbuildConfigObjects(element, name);
            // Apaga a referência ao método destroy.
            element.removeData('destroy');
            // Apaga referência do objeto no element
            element.removeData(dataObjName);
            // Marca do fim da ativação
            element.removeAttr(activeAttr);
            // Avisa sobre a ativação
            console.info('"' + name + '" destruído para o elemento', element);
        });
    };

    /**
     * __Para uso exclusivo dos desenvolvedores do PIC.__
     *
     * Registra um widget no PIC.
     *
     * 1. Guarda o nome do widget e uma referência a sua função construtora para uso posterior.
     *
     * 2. Estende o jQuery para dar acesso à instância do widget por meio de um objeto jQuery. Por exemplo, o desenvolvedor marca uma div com `data-pic-modal`, dessa forma:
     *
     *        <div id="meuModal" data-pic-modal> ... Conteúdo ... </div>
     *
     *    Depois disso, ele pode controlar o modal programaticamente assim:
     *
     *        $("#meuModal").picModal().show();
     *
     *    Observe que o nome do widget será prefixado por "pic"; Assim, o widget `Modal`, por exemplo, será referenciado por `picModal`.
     *
     * 3. Estende o próprio namespace do PIC para acesso a métodos estáticos (métodos que não dependem de uma instância do widget), se houver. Por exemplo, o desenvolvedor pode acessar o método `markError` do widget `Validation` da seguinte forma:
     *
     *         PIC.Validation.markError(...);
     * @function
     * @memberof PIC
     * @param Widget {constructor} A função construtora que implementa o widget.
     */
    PIC.widgetRegister = function (Widget) {

        var name = Widget.prototype.name,
            dataObjName = 'pic' + name + 'Obj';

        console.info('Registrando widget "' + name + '"');

        // Inclui o nome do widget na lista de widgets registrados
        widgets.push(name);
        // Inclui a referência ao construtor do widget na lista.
        widgetsMap[name] = Widget;

        // Extende o jQuery
        // Cria-se uma função para cada widget registrado
        // que retorna a instância do widget associada a um elemento determinado.
        // Por exemplo: $(seletor).picActionsbar()
        // retorna uma instância de Actionsbar, permitindo o acesso aos métodos
        // públicos definidos pelo widget.
        $.fn['pic' + name] = function () {
            //  caso 'this' refira-se a mais de um elemento, retorna apenas a instância
            // referente ao primeiro deles.
            return this.first().data(dataObjName);
        };

        // Aqui, são tratados os métodos estáticos (que não dependem de uma instância)
        // do Widget. Um método estático fica acessível para o desenvolvedor da seguinte forma:
        // PIC.Widget.metodo()  >>> por exemplo: PIC.Validation.markError()
        // Para cada método do widget
        $.each(Widget, function (methodName, method) {
            // Estende o PIC, se for o caso, com um objeto que tem o mesmo nome do widget.
            PIC[name] = PIC[name] || {};
            // Estende o objeto com o nome do widget com o método.
            PIC[name][methodName] = method;
        });
    };


    /**
     * Ativa as instâncias de um determinado widget. Isso significa, grosso modo, fazer uma busca
     * pelos elementos estão marcados para se transformar no widget em questão,
     * e fazer a ativação para todos esses elementos.
     *
     * @function
     * @memberof PIC
     * @see PIC.destroyWidget
     * @param name {string} Nome do widget com inicial maiúscula (ex.: `Localnav`);
     * @param [context=document] {(Selector|Element|jQuery)} Trecho do documento a partir do qual será aplicada a ativação.
     *        A busca por elementos ativáveis será feita a partir do elemento `context`, incluindo seus filhos no DOM.
     * @param [options] {JSON} Opções que podem ser passadas para o widget.
     *        É semelhante ao que é passado por meio do valor do atributo `data-pic-nomedowidget`.
     *        As opções passadas por aqui têm prioridade sobre aquelas passadas via valor do atributo.
     * @@param [force=false] Quando `true`, força a ativação. Desconsidera a necessidade do atributo `data-pic-nomedowidget`, e usa o parâmetro
     *          `context` como ponto de ativação. _Para uso exclusivo dos desenvolvedores do PIC_.
     */
    PIC.activateWidget = function (name, context, options, force) {

        var elements;

        elements = getElementsToActivate(name, context, force);

        if (elements === undefined) {
            console.warn ('PIC.activateWidget: "' + name + '": não ativado. Verifique se o valor informado para "context" é válido: ', context);
        } else if (!isWidgetRegistered(name)) {
            console.warn ('PIC.activateWidget: "' + name + '" parece não ter sido registrado. Ativação abortada.');
        } else {

            activate(name, elements, options, force);
        }
    };

    /**
     * Destrói as instâncias de um determinado widget. Isso significa, grosso modo, fazer uma busca
     * pelos elementos estão ativados como o widget em questão, e retorná-los a seu estado
     * original (de antes da ativação).
     *
     * @function
     * @memberof PIC
     * @see PIC.activateWidget
     * @param name {string} Nome do widget com inicial maiúscula (ex.: `Localnav`);
     * @param [context=document] {(Selector|Element|jQuery)} Trecho do documento a partir do qual será feita a destruição.
     *        A busca por elementos ativados será feita a partir do elemento `context`, incluindo seus filhos no DOM.
     * @@param [force=false] Quando `true`, destrói instâncias ativadas de forma forçada.
     *        Usa o parâmetro `context` como ponto de destruição. _Para uso exclusivo dos desenvolvedores do PIC_.
     */
    PIC.destroyWidget = function (name, context, force) {

        var elements;

        elements = getElementsToDestroy(name, context, force);

        if (elements === undefined) {
            console.warn ('PIC.destroyWidget: "' + name + '": não destruído. Verifique se o valor informado para "context" é válido: ', context);
        } else if (!isWidgetRegistered(name)) {
            console.warn ('PIC.destroyWidget: "' + name + '" parece não ter sido registrado. Destruição abortada.');
        } else {

            destroy(name, elements);
        }
    };

    /**
     * Reativa as instâncias de um determinado widget. Isso significa, grosso modo, fazer uma busca
     * pelos elementos estão ativados como o widget em questão, retorná-los a seu estado
     * original (de antes da ativação), e ativá-los novamente.
     *
     * @function
     * @memberof PIC
     * @see PIC.activateWidget
     * @see PIC.destroyWidget
     * @param name {string} Nome do widget com inicial maiúscula (ex.: `Localnav`);
     * @param [context=document] {(Selector|Element|jQuery)} Trecho do documento a partir do qual será feita a destruição.
     *        A busca por elementos ativados será feita a partir do elemento `context`, incluindo seus filhos no DOM.
     */
    PIC.refreshWidget = function (name, context) {
        PIC.destroyWidget(name, context);
        PIC.activateWidget(name, context);
    };

    /**
     * Ativa as instâncias de todos os widgets registrados. Isso significa, grosso modo, fazer uma busca
     * pelos elementos estão marcados para se transformar em algum widget,
     * e fazer a ativação para todos esses elementos.
     *
     * @function
     * @memberof PIC
     * @see PIC.activateWidget
     * @param [context=document] {(Selector|Element|jQuery)} Trecho do documento a partir do qual será aplicada a ativação.
     *        A busca por elementos ativáveis será feita a partir do elemento `context`, incluindo seus filhos no DOM.
     */
    PIC.activateAllWidgets = function (context) {

        $(widgets).each(function (index, name) {
            PIC.activateWidget(name, context);
        });
    };

    /**
     * Destrói as instâncias de todos os widgets registrados. Isso significa, grosso modo, fazer uma busca
     * pelos elementos estão ativados como widget, e retorná-los a seu estado
     * original (de antes da ativação).
     *
     * @function
     * @memberof PIC
     * @see PIC.destroyWidget
     * @param [context=document] {(Selector|Element|jQuery)} Trecho do documento a partir do qual será feita a destruição.
     *        A busca por elementos ativados será feita a partir do elemento `context`, incluindo seus filhos no DOM.
     */
    PIC.destroyAllWidgets = function (context) {

        $(widgets).each(function (index, name) {
            PIC.destroyWidget(name, context);
        });
    };


    /**
     * Prepara elementos para se transformar em instâncias de um determinado widget.
     * Serve para evitar a necessidade de manipular "manualmente" o DOM para poder incluir os atributos
     * e valores exigidos pelo PIC para a criação de um widget.
     *
     * Não afeta elementos nos quais haja alguma instância de widget ativa.
     *
     * Não provoca a ativação das instâncias; isso é feito por meio do conjunto de métodos `PIC.activate*`.
     *
     * @function
     * @memberof PIC
     * @param name {string} Nome do widget com inicial maiúscula (ex.: `Localnav`);
     * @param target {(Selector|Element|jQuery)} Elemento que será preparado.
     *        Se `target` referir-se a mais de um elemento, todos eles serão preparados.
     * @param [options] {JSON} Opções que podem ser passadas para o widget.
     *        É o que vai aparecer como valor do atributo `data-pic-nomedowidget`.
     * @returns {jQuery} Lista de elementos nos quais a preparação foi feita.
     */
    PIC.prepareWidget = function (name, target, options) {

        var elements;

        // Verifica se name refere-se a widget registrado.
        if (!isWidgetRegistered(name)) {
            console.warn ('PIC.prepareWidget: "' + name + '" parece não ter sido registrado. Preparação abortada.');
            return $(); // Retornando um conjunto vazio de elementos jQuery, para indicar que nenhum elemento foi preparado.
        }

        // Se options já foi passado como string, entende-se que esse string já
        // representa um JSON com os parâmetros desejados.
        if ($.type(options) !== 'string') {
            // Se não for string, converte options de objeto para string.
            options = optionsObjectToString(options);
        }

        // Remove do conjunto os elementos que estiverem ativos
        elements = $(target).not('[data-pic-active]');

        // Verifica se target endereça algum elemento que já não esteja ativo
        if (elements.length === 0) {
            console.warn('PIC.prepareWidget: "' + name + '" não preparado. Verifique se o valor informado para "target" é válido: ', target);
            return elements;
        }

        // Se veio até aqui, está tudo certo: é prosseguir com a preparação efetivamente.
        prepare(name, elements, options);

        // Retorna os widgets preparados.
        return elements;
    };

    /*
     * WidgetHelper
     * Objeto que auxilia os widgets em suas tarefas comuns
     */
    WidgetHelper = function (widget, element, jsOptions) {

        widgetInstanceId++;

        this.element = element;
        this.options = collectOptions(element, widget.name, jsOptions, widget.defaults, widget.domains);
        this.eventNamespace = '.pic.' + widget.name + '.wid_' + widgetInstanceId;
        this.instanceId = 'wid_' + widgetInstanceId;
    };

    WidgetHelper.prototype = {

        /*
         * Remove os listeners de eventos adicionados pela instância do widget.
         * - Do próprio element e seus filhos
         * - De document e window
         *
         * @method clearEvents
         */
        clearEvents: function () {
            this.element.find('*').addBack().off(this.eventNamespace);
            $(document).off(this.eventNamespace);
            $(window).off(this.eventNamespace);
        },

        /*
         * Verifica se o elemet cabe ou não na janela, testando
         * se a parte de baixo de element ultrapassa a parte de baixo da janela.
         *
         * @method fitDown
         * @param [element] {mixed} - Elemento ou objeto jQuery a ser testado. Se não informado, utiliza this.element
         * @param [placeholderHeight] {number} - Altura em px que deve estar disponível abaixo de
         *        element. Use esse parâmetro para verificar se um outro elemento (cuja altura já
         *        é conhecida) caberia abaixo de element.
         * @returns {boolean} Indica se cabe (true) ou não (false) na janela.
         */
        fitDown: function (element, placeholderHeight) {

            var elementBottom,
                windowBottom = $(window).actual('height');

            // Se não foi passado o parâmetro element, assume o próprio element do widget
            element = element || this.element;
            // Se não foi passado o parâmetro placeholderHeight, assume 0.
            placeholderHeight = placeholderHeight || 0;

            // Se o element é uma objeto jQuery, obtém o DOM element correspondente.
            element = element instanceof jQuery ? element[0] : element;

            // Obtém a posição inferior do element e a altura da janela
            elementBottom = element.getBoundingClientRect().bottom;

            return ((elementBottom + placeholderHeight) <= windowBottom);
        }
    };

})(window.PIC = window.PIC || {}, jQuery);


/*
 * Extensão do jQuery
 * Isso foi extraído diretamente do código do jQueryUI,
 * aproveitando apenas o estritamente necessário para o nosso caso,
 * ou seja: uniqueId e removeUniqueId.
 * Foi modificado somente o formato: de ui-id-* para pic-id-*
 */
;(function ($) {

    $.fn.extend({

        uniqueId: (function() {
            var uuid = 0;

            return function() {
                return this.each(function() {
                    if ( !this.id ) {
                        this.id = "pic-id-" + ( ++uuid );
                    }
                });
            };
        })(),

        removeUniqueId: function() {
            return this.each(function() {
                if ( /^pic-id-\d+$/.test( this.id ) ) {
                    $( this ).removeAttr( "id" );
                }
            });
        }
    });

})(jQuery);


/*
 * Extensão do jQuery
 * Código utilitário do PIC, que precisou se escrito como extensão do jQuery para valer-se
 * do esquema de encadeamento fornecido por ele.
 * Separado do bloco de extensão anterior por conter código produzido pela equipe do PIC.
 */
;(function ($) {

    $.fn.extend({

        /*
         * Reduz o conjunto de elementos para aqueles que possuem a configuração informada.
         * Dado um objeto jQuery que representa um conjunto de elementos DOM, o método
         * constrói um novo objeto jQuery a partir de um subconjunto de elementos cuja configuração
         * corresponde ao especificado.
         *
         * Assinaturas:
         * .filterByConfig (widgetName)
         *  Retorna os elementos que possuam configuração relativa a esse widget.
         *
         * .filterByConfig (widgetName, param)
         *  Retorna os elementos que possuam o parâmetro 'param' informado na configuração
         *  relativa a esse widget.
         *
         * .filterByConfig (widgetName, param, expectedValue)
         *  Retorna os elementos cujo parâmetro 'param' informado na configuração
         *  relativa a esse widget possua o valor 'expectedValue'.
         */
        filterByConfig: function (widgetName, param, expectedValue) {

            /*
             * Percorre o objeto informado, retornando true se encontrar o que procura, que pode ser:
             * - se 'expectedValue' for informado, a existência da chave 'param' associada ao valor 'expectedValue'.
             * - se 'expectedValue' não for informado, a mera existência da chave 'param'.
             * O objeto a ser percorrido pode ser:
             * - um objeto "simples";
             * - um array de objetos;
             * - um objeto contendo arrays;
             * - a combinação dessas possibilidades (viva a recursividade!)
             */
            var find = function (objConfig, param, expectedValue) {

                // A princípio, não encontrou nada.
                var found = false;

                // Se estivermos tratando de um array
                if ($.type(objConfig) === 'array') {

                    // Para cada posição do array
                    $.each(objConfig, function (index, itemConfig) {
                        // Faz a busca na posição atual do array.
                        found = find(itemConfig, param, expectedValue);
                        // Se o que se está buscando foi encontrado,
                        // força a saída do loop each (não precisa continuar buscando).
                        if (found) {
							return false;
						}
                    });

                // Se não estivermos tratando de um array, é um objeto "simples".
                } else {

                    // Se não foi informado um valor específico
                    if (expectedValue === undefined) {
                        // found recebe true se a chave existe no objeto.
                        found = (objConfig[param] !== undefined);

                    // Se foi informado um valor específico
                    } else {
                        // found recebe true se a chave (além de existir) está associada ao valor informado.
                        found = (objConfig[param] === expectedValue);
                    }
                }
                // Retorna true se encontrou o que se buscava.
                return found;
            };

            /*
             * FilterByConfig usa o método 'filter' do jQuery, passando como parâmetro
             * a função que filtra de acordo com a configuração desejada.
             * O retorno de FilterByConfig é justamente o retorno de filter.
             * Isso quer dizer que a extensão filterByConfig pode ser vista simplesmente
             * como uma chamada a filter(), passando como parâmetro a função aqui definida.
             */
            return this.filter(function () {

                var objConfig;

                // Obtém o objeto de configuração com a configuração correspondente ao widget.
                objConfig = $(this).config(widgetName);

                // Se existir a configuração para o widget
                if (objConfig) {

                    // Se foi informado um parâmetro específico
                    if (param !== undefined) {

                        // Se expectedValue for informado, retorna true se o parâmetro existe e corresponde a esse valor.
                        // Se expectedValue não for informado, retorna true se o parâmetro existe.
                        return find(objConfig, param, expectedValue);

                    // Se não foi informado um parâmetro específico, o que se quer testar é se
                    // apenas a configuração existe. Como existe (já foi testado!), retorna true.
                    } else {

                        return true;
                    }

                // Se não existir objeto de configuração, retorna false.
                } else {

                    return false;
                }
            });
        },

        /*
         * Funciona da mesma forma como o método 'data()' do jQuery.
         * A especificidade aqui é que o primeiro parâmetro (widgetName) não deve ser entendido
         * como um valor genérico mas, sim, como o nome de um widget do PIC; além disso, esse
         * nome é complementado com outro string antes de ser usado para armazenamento.
         */
        config: function (widgetName, value) {

            if (value === undefined) {
                // Retorna um valor específico
                return this.data(widgetName + 'Config');
            } else {
                // Retorna o objeto chamador, permitindo o encadeamento (ver documentação do data())
                return this.data(widgetName + 'Config', value);
            }
        },

        removeConfig: function (widgetName) {

            return this.removeData(widgetName + 'Config');
        }
    });
})(jQuery);


;(function () {

    'use strict';

    // Lista de teclas úteis
    key = {
        'backspace': 8,
        'tab': 9,
        'enter': 13,
        'shift': 16,
        'ctrl': 17,
        'alt': 18,
        'pause': 19,
        'capslock': 20,
        'esc': 27,
        'pageup': 33,
        'pagedown': 34,
        'end': 35,
        'home': 36,
        'left': 37,
        'up': 38,
        'right': 39,
        'down': 40,
        'insert': 45,
        'delete': 46,
        '0': 48,
        '1': 49,
        '2': 50,
        '3': 51,
        '4': 52,
        '5': 53,
        '6': 54,
        '7': 55,
        '8': 56,
        '9': 57,
        'a': 65,
        'b': 66,
        'c': 67,
        'd': 68,
        'e': 69,
        'f': 70,
        'g': 71,
        'h': 72,
        'i': 73,
        'j': 74,
        'k': 75,
        'l': 76,
        'm': 77,
        'n': 78,
        'o': 79,
        'p': 80,
        'q': 81,
        'r': 82,
        's': 83,
        't': 84,
        'u': 85,
        'v': 86,
        'w': 87,
        'x': 88,
        'y': 89,
        'z': 90,
        '0numpad': 96,
        '1numpad': 97,
        '2numpad': 98,
        '3numpad': 99,
        '4numpad': 100,
        '5numpad': 101,
        '6numpad': 102,
        '7numpad': 103,
        '8numpad': 104,
        '9numpad': 105,
        'multiply': 106,
        'plus': 107,
        'minut': 109,
        'dot': 110,
        'slash1': 111,
        'F1': 112,
        'F2': 113,
        'F3': 114,
        'F4': 115,
        'F5': 116,
        'F6': 117,
        'F7': 118,
        'F8': 119,
        'F9': 120,
        'F10': 121,
        'F11': 122,
        'F12': 123,
        'equal': 187,
        'coma': 188,
        'slash': 191,
        'backslash': 220
    };
})(window.key = window.key || {});


/* -------------------------------------------------------------------------------------------------
 * Área sem nada implementado, apenas documentação JSDocs complementar
 * -------------------------------------------------------------------------------------------------
 */

/**
 * Um string que represente um seletor jQuery. Por exemplo:
 * - `table`: endereça todas os elementos `table`.
 * - `.active`: endereça todas os elementos que possuam a classe `active`.
 * - `#title`: endereça o elemento cujo id seja `title`.
 * - etc.
 * @typedef {(string)} Selector
 */

/**
 * Um elemento do DOM (Document Object Model).
 * @typedef Element
 */

/**
 * Um objeto jQuery. Por exemplo:
 * - `$(window)`: endereça `window`.
 * - `$('table')`: endereça todas os elementos `table`.
 * - `$('#title')`: endereça o elemento cujo id seja `title`.
 * - etc.
 * @typedef jQuery
 */

/**
 * Um objeto no formato JSON (JavaScript Object Notation).
 * @see {@link http://www.json.org/|Introducing JSON}
 * @typedef JSON
 */

})();
/* Início de novo arquivo concatenado */
(function () {/* Bootstrap */
/* Corrige o comportamento navbar-toggle em telas pequenas */
var dataTargetShow, $prevNavBarToggle = {};
$(".navbar-toggle").click(function(){
	var $navBarToggle = $(this);
	
	if($.isEmptyObject($prevNavBarToggle) !== true){
		$prevNavBarToggle.removeClass("active");
	}
	
	$navBarToggle.addClass("active");	
	$(dataTargetShow).collapse('hide');
	
	var dataTarget = $(this).attr("data-target");
	$(dataTarget).collapse('show');
	dataTargetShow = dataTarget;
	$prevNavBarToggle = $(this);
});
/* --- */

})();
/* Início de novo arquivo concatenado */
(function () {/* Datatable */
/**
Transforma tabela em uma datatable com ordenação, filtro e paginação.

@complement Configuração_interna
- `asc` / `desc`: Aplicada a uma coluna (`th`).

  Determina a ordenação inicial da tabela por meio da coluna marcada.
  Essa ordenação pode ser de forma ascendente (`asc`) ou do descendente (`desc`).
  Por padrão, a tabela inicia ordenada a partir da primeira coluna de forma ascendente.
  Apenas uma coluna deveria ter essa configuração. Se mais de uma coluna for configurada para
  ordenação, apenas uma (a mais à esquerda) será considerada.

- `nofilter`: Aplicada a uma ou mais colunas (`th`).

  Determina que a coluna marcada não será incluida no filtro.

- `nosort`: Aplicada a uma ou mais colunas (`th`).

  Determina que a tabela não pode ser ordenada por meio dessa coluna.

- `customcontent`: Aplicada a uma ou mais coluna (`th`).

  Informa ao widget que a coluna marcada não receberá dados remotos. Com essa configuração, pode-se
  "reservar" colunas para conter dados que não estão contidos na fonte, mas que derivam deles.
  Veja o evento `pic:beforedraw`.

- `display`: Quando aplicada em uma coluna, deve ser aplicada a outras colunas (`th`).

  _Não se aplica quando `sourceType=inline`._

  Indica qual dado da fonte de dados a coluna vai conter.

  Quando os dados estiverem no formato de array de duas dimensões, deve ser informado como string representando um número (número entre aspas).
  A primeira posição é numerada com 0 (zero). Por exemplo: `"display": "1"` (a coluna mostrará dados da segunda posição do array).

  Quando os dados estiverem no formato de array de objetos, deve ser um informado como string.
  Se os objetos possuírem outros objetos aninhados, é possível fazer referência aos
  níveis mais internos com a notação de ponto. Por exemplo: `"display": "telefone.celular"`

  Quando informado para uma coluna, deve ser informado para todas as outras
  que recebam dados provenientes da fonte de dados (ou seja, as que não estejam
  configuradas como `customcontent`).

- `sort` (em uma coluna): Aplicada a uma ou mais colunas (`th`).

  _Não se aplica quando `sourceType=inline`._

  Indica qual dado da fonte de dados será usado para ordenação da coluna.

  Quando os dados estiverem no formato de array de duas dimensões, deve ser informado como valor numérico.
  A primeira posição é numerada com 0 (zero). Por exemplo: `"sort": 1` (a segunda posição do array será usada para ordenação da coluna).

  Quando os dados estiverem no formato de array de objetos, deve ser um informado como string.
  Se os objetos possuírem outros objetos aninhados, é possível fazer referência aos
  níveis mais internos com a notação de ponto. Por exemplo: `"sort": "telefone.celular"`

- `sort` (em uma célula): Quando aplicada a uma célula, deve ser aplicada às demais células da mesma coluna (`td`).

  _Somente se aplica a `sourceType=inline`._

  Indica qual valor será considerado para ordenar a célula dentro da coluna.

- `filter` (em uma coluna): Aplicada a uma ou mais colunas (`th`).

  _Não se aplica quando `sourceType=inline`._

  Indica qual dado da fonte de dados será usado para filtro da coluna.

  Quando os dados estiverem no formato de array de duas dimensões, deve ser informado como valor numérico.
  A primeira posição é numerada com 0 (zero). Por exemplo: `"filter": 1` (a segunda posição do array será usada para filtro da coluna).

  Quando os dados estiverem no formato de array de objetos, deve ser um informado como string.
  Se os objetos possuírem outros objetos aninhados, é possível fazer referência aos
  níveis mais internos com a notação de ponto. Por exemplo: `"filter": "telefone.celular"`

- `filter` (em uma célula): Quando aplicada a uma célula, deve ser aplicada às demais células da mesma coluna (`td`).

  _Somente se aplica a `sourceType=inline`._

  Indica qual valor será considerado para filtrar a célula.


@complement Formato_dos_dados
Quando o widget obtém os dados remotamente, eles precisam ser entregues em um formato específico,
assim definido:

	{
		draw: (número igual ao que foi entregue pelo widget na requisição),
		recordsTotal: (número total de registros/linhas da base de dados),
		recordsFiltered: (número de registros/linhas que atendem ao filtro aplicado; se não houver filtro, deve ser igual ao total),
		data: (array com os dados propriamente ditos - ver exemplos a seguir)
	}

Cada elemento do array `data` deve estar em um dos seguintes formatos:

- array de strings, em que cada posição do array corresponde a uma coluna. A correspondência entre
  os elementos do array e as colunas da tabela é posicional, ou seja, o primeiro elemento ficará
  na primeira coluna, o segundo na segunda, e assim sucessivamente:

      data: [
		      ["Abel", "Analista", "P_4321"],
		      ["Bernardo", "Técnico", "P_1234"]
			]

- objeto json com chaves nomeadas (formato string). Para utilização desse formato de dados,
  é necessário fazer a correspondência entre os dados e as colunas onde devem ser mostrados,
  por meio da configuração `display`.

      data: [
		      {nome: "Abel", cargo: "Analista", ponto: "P_4321"},
		      {nome: "Bernardo", cargo: "Técnico", ponto: "P_1234"}
			]



- objeto json com chaves numéricas iniciando em "0", em que cada par chave-valor corresponde a
  uma coluna. A correspondência entre os elementos do array e as colunas se dá pela chave, ou seja,
  o elemento de chave "0" ficará na primeira coluna, o de chave "1" na segunda, e assim sucessivamente.
  Quando se utiliza esse formato, é possível informar ao widget dados de identificação de linha,
  que não são mostrados diretamente na tabela:

      data: [
		      {"0": "Abel", "1": "Analista", "2": "P_4321"},
		      {"0": "Bernardo", "1": "Técnico", "2": "P_1234"}
            ]

@complement Dados_de_identificação_de_linha

Há situações em que, ao receber dados remotos, é necessário identificar a que registro corresponde
cada linha na tabela. Geralmente, essa identificação não é útil para o usuário do sistema, e não
faz sentido que seja uma coluna da tabela. Para atender a essa necessidade, há dois dados que
podem ser passados para o widget:

- picRowId: esse valor será definido como valor do atributo `id` da linha (`tr`) correspondente
  ao registro. Usualmente, é um valor que identifica unicamente o registro, que será utilizado
  no tratamento de eventos associados àquela linha (ação de "editar", por exemplo).
  Observe que esse o atributo `id` de um elemento HTML deve ser único por página; a aplicação
  deve tratar de garantir isso.

- picRowData: esse valor será definido como atributo `data-row-data` da linha (`tr`) correspondente
  ao registro. Um uso possível para esses dados genéricos pode ser, por exemplo, a indicação de
  que ações estão disponíveis (devem ser mostradas) para cada uma das linhas. Note que o widget
  apenas deixa disponível esses dados no atributo citado, e não faz qualquer uso deles; o uso
  depende das necessidades específicas da aplicação, que deve criar scripts para tratá-closest
  adequadamente.


    data: [
            {0: "Abel", 1: "Analista", 2: "P_4321", picRowId: "p4321", picRowData: "{level:1,edit:true}" },
            {0: "Bernardo", 1: "Técnico", 2: "P_1234", picRowId: "p1234", picRowData: "{leve:2,edit:false}"}
	      ]


@module Datatable
@attribute data-pic-datatable
@param {boolean} [filter=true] - Habilita ou desabilita coluna para filtragem geral da tabela.
@param {boolean} [sort=true] - Habilita ou desabilita coluna para ordenação.
@param {mixed} [paginate=[10,20,50]] - Define a paginação para a tabela. Pode ser informado como:
- boolean: `false`, mostra todas as linhas (sem paginação); `true`, mantém o valor default.
- number: valor inteiro, positivo, que define quantas linhas serão mostradas por página (não dá escolha de modificação para o usuário).
- array contendo valores inteiros, positivos: cada posição do array é uma opção. O valor padrão, por exemplo, permite mostrar 10, 20 ou 50 linhas por página. A opção "Todos" é disponibilizada automaticamente.

__Observação__: se `sourceType=serverControl`, o widget impedirá qualquer situação em que resulte na exibição de todas as linhas.
@param {string} [source] - Indica a localização da fonte de dados. Pode ser:
- A URI de um arquivo JSON contendo todos os dados da tabela.
  O widget obterá o arquivo e ele mesmo cuidará das ações de filtro, ordenação etc.
  Nesse caso, use `sourceType=serverData`
- A URI de um recurso (servidor) que forneça um JSON contendo os dados que serão mostrados de acordo com os parâmetros informados do widget para o recurso.
  As ações de filtro, ordenação etc. ficarão a cargo desse recurso.
  Nesse caso, use `sourceType=serverControl`
- Os dados propriamente ditos, no formato JSON, contendo todos os dados da tabela.
  O widget obterá os dados e ele mesmo cuidará das ações de filtro, ordenação etc.
  Nesse caso, use `sourceType=data`.
- Caso os dados da tabela já estiverem no HTML, esse parâmetro não deve ser informado.
@param {string} [sourceType=inline] - Indica o tipo da fonte de dados para o Datatable. Caso os dados da tabela já estiverem no HTML, esse parâmetro não deve ser informado (mantido o valor padrão). Note que tem forte relação com o parâmetro `source`.
       Valores possíveis: serverControl|serverData|data|inline.
@param {string|array} [datePatterns] - Define formatos das datas usadas em colunas de datas. Necessário apenas se na tabela houver datas fora dos formatos padrão "DD/MM/YYYY", "DD/MM/YYYY HH:mm:ss" e "DD-MM-YYYY HH:mm:ss". Sem o formato correspondente indicado, o widget não poderá ordenar corretamente a coluna de data. Exemplos de valores válidos: "YYYY/MM/DD" ou ["yyyy/mm/dd","yyyy/dd/mm HH:mm:ss"]. Consulte http://momentjs.com/docs/#/parsing/string-format/ para mais detalhes.
@param {JSON} [requestHeaders] - Cabeçalhos adicionais a serem passados na requisição remota de dados.
Aceita um JSON contendo chaves e valores dos cabeçalhos. Ex.: `{"Authorization": "token"}`.
Usado apenas quando `sourceType=serverData` ou `sourceType=serverControl`.

@fires pic:beforedraw
@fires pic:beforeshow
@example
<table class='table' data-pic-datatable>
    <thead>
        <tr>
            <th data-pic-datatable-config='["desc", "nosort"]'>Coluna 1</th>
            <th data-pic-datatable-config='nofilter'>Coluna 2</th>
            <th data-pic-datatable-config='nosort'Coluna 3></th>
        </tr>
    </thead>
        <tr>
            <td>Valor 10</td>
            <td>Valor 20</td>
            <td>Valor 30</td>
        </tr>
        <tr>
            <td>Valor 11</td>
            <td>Valor 21</td>
            <td>Valor 31</td>
        </tr>
    <tbody>
    </tbody>
</table>
 */

/**
 * Esse evento é útil para criar, utilizando dados da tabela, elementos que derivam desses dados.
 * Um caso típico é a criação de ações associadas a cada uma das linhas da tabela, usando, por
 * exemplo, [Actionsbar]{@link module:Actionsbar}. As ações não serão dados da tabela, mas
 * dependem desses dados (por exemplo, do `id` associado à linha) para serem construídas.
 *
 * Nesse caso, teremos uma coluna da tabela cujo conteúdo é criado dinamicamente.
 * Para construir esse tipo de solução, observe também a documentação sobre
 * `customcontent`, `picRowId`e `picRowData`.
 *
 * @event pic:beforedraw
 * @param {object} json - JSON contendo a informação sobre o que será mostrado na tabela,
 *                        incluindo um array (data) com os dados de cada linha contida na
 *                        página atual.
 */

/**
 * Esse evento é idêntico ao `pic:beforedraw`.
 * Ele existe apenas por uma questão de compatibilidade.
 *
 * Deve-se usar, preferencialmente, o `pic:beforedraw`.
 *
 * @event pic:beforeshow
 */


;(function ($, window, document, undefined) {

    'use strict';

    /*
     * Variáveis globais
     * no escopo da closure
     */
	var XS_PAGE_LENGTH = 10;

    /*
     * Tudo o que for necessário executar apenas uma vez, na carga da página
     * deve estar escrito aqui.
     * Se, por exemplo, o plugin que está sendo extendido expõe seus valores default
     * e é necessário modificar algum desses valores de forma geral,
     * isso deve ser feito aqui.
     */
	// $.fn.pluginOriginal.defaults.opcao = 'novo-valor';

	// Função auxiliar para mapear caracteres acentuados e não acentuados.
	function removeAccents(str) {
		var accents    = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
		var accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
		str = str.split('');
		var strLen = str.length;
		var i, x;
		for (i = 0; i < strLen; i++) {
			if ((x = accents.indexOf(str[i])) != -1) {
				str[i] = accentsOut[x];
			}
		}
		return str.join('');
	}

	// Funcão auxiliar para detectar se o dado é considerado "vazio" para ordenação.
	var _empty = function ( d ) {
		return !d || d === true || d === '-' ? true : false;
	};

	// Substituindo a função de ordenação de string padrão do plugin Datatables.
	// Pode-se considerar com a criação de um plugin, conforme documentado em: https://datatables.net/manual/plug-ins/sorting
	$.fn.dataTable.ext.type.order['string-pre'] = function(a) {
		// Um pouco complexo, mas mais rápido do que sempre chamar toString,
		// http://jsperf.com/tostring-v-check
		// Esse código foi inspirado na função de ordenação padrão de string do plugin Datatables.
		// Aqui, optou-se por fazer a ordenação "na mão", em vez de usar internacionalização,
		// por questões de compatibilidade com ie10 e anteriores.
		return _empty(a) ?
				'' :
				typeof a === 'string' ?
				removeAccents(a.toLowerCase()) :
					! a.toString ?
						'' :
						removeAccents(a.toString());
	};


    /*
     * Definição da classe
     */
    var Datatable = function (widgetHelper) {

         /*
         * Variáveis de instância
         * Defina todas aqui antes de usar
         */
        var name = this.name,
            element = widgetHelper.element,
            options = widgetHelper.options,
            eventNamespace = widgetHelper.eventNamespace,
            api = {},
            paginateValues,
            paginateLabels,
            lengthChange,
            pageLength,
            paging,
			table,
			userMsgContainer,
			userMsgList = [],
			lastDrawnPage = 0,
			latestJson = [],
			serverSide = false,
			ajaxOptions,
			searchDelay,
			rowId,
			arrPosAttrs = [],
			columns = null,
			jsonData = null,
			objectDataSrc = false,
			hasCustom = false,
			hasDisplayConfig = false,
			indexColumnRemote = 0,
			datatableControls = "<'row'<'col-sm-6'l><'col-sm-6'f>>" +
								"<'row'<'col-sm-12'tr>>" +
								"<'row'<'col-sm-5'i><'col-sm-7'p>>";

        /*
         * Métodos públicos
         */

        var destroy = function () {
            // Remove listeners dos eventos
            widgetHelper.clearEvents();
            // Aciona o destroy do DataTable (original)
            element.DataTable().destroy();

            // Desfaz coisas que o destroy DataTable não desfez (mas deveria):
            // - Remove atributos da table
            element.removeAttr('aria-describedby role');
            // - Remove atributos das th
            element.find('th').removeAttr('tabindex aria-controls aria-label');
            // - Remove atributos das tr
            element.find('tr').removeAttr('role');

            // Remove classe adicionada de acordo com a configuração
            element.find('th.noSortable').removeClass('noSortable');
            // Remove classes gerais e id
            element.removeClass('table-striped table-hover');
            element.removeUniqueId();
        };

        /**
         * Dispara a requisição dos dados remotos (quando há alguma coluna configurada como `customcontent`)
         *
         * Quando há alguma coluna configurada como `customcontent`, não faz a primeira requisição
		 * de dados remotos até que esse método seja chamado.
		 *
		 * Dessa forma, é possível preparar tudo o que for preciso antes (como os listeners de
		 * eventos disparados pelo widget), para só então iniciar as requisições.
		 *
		 * O método deve ser chamado uma única vez para cada instância do widget.
		 *
		 * Não está disponível quando `sourceType=inline`
         *
         * @method loadData
         * @instance
         */
		var loadData = function () {

			if (hasCustom) {
				instanceDatatables();
			}
		};

        /**
         * Remove uma linha da tabela.
		 *
		 * O widget removerá a linha correspondente ao seletor informado e atualizará a
		 * visualização da tabela.
		 *
		 * Disponível quando `sourceType=data` ou `sourceType=inline`
         *
         * @method remove
		 * @param [selector] {Element|jQuery|Selector} - Seletor que corresponde a uma única
		 *        linha a ser removida.
         * @instance
         */
        /**
         * Avisa ao widget que uma linha foi removida.
		 *
		 * Após a remoção de uma linha da base de dados, esse método deve ser chamado para que o
		 * widget atualize a visualização da tabela.
		 *
		 * Disponível quando `sourceType=serverData` ou `sourceType=serverControl`
         *
         * @method remove
         * @instance
         */
		var remove = function (selector) {

			pushUserMsg("warning", "Tabela alterada, linha removida.");

			if (options.sourceType === 'serverControl' || options.sourceType === 'serverData') {
				reload();
			}
			else {
				table.row(selector).remove().draw(true);
			}
		};

        /**
         * Insere uma linha na tabela.
		 *
		 * O widget inserirá a linha com os dados informados e atualizará a
		 * visualização da tabela.
		 *
		 * Disponível quando `sourceType=data` ou `sourceType=inline`
         *
         * @method insert
		 * @param [data] {array|JSON} - Dados que representam uma linha da tabela. Veja os formatos
		 *        possíveis na seção "Formato dos dados"
         * @instance
         */
        /**
         * Avisa ao widget que uma linha foi inserida.
		 *
		 * Após a inserção de uma linha na base de dados, esse método deve ser chamado para que o
		 * widget atualize a visualização da tabela.
		 *
		 * Disponível quando `sourceType=serverData` ou `sourceType=serverControl`
         *
         * @method insert
         * @instance
         */
		var insert = function (data) {

			pushUserMsg("warning", "Tabela alterada, linha inserida.");

			if (options.sourceType === 'serverControl' || options.sourceType === 'serverData') {
				reload();
			}
			else {
				table.row.add(data).draw(true);
			}
		};

        /**
         * Recarrega os dados a partir da fonte remota.
		 *
		 * Disponível quando `sourceType=serverData` ou `sourceType=serverControl`
         *
         * @method reload
         * @instance
         */
		var reload = function () {
			table.clearPipeline();
			table.ajax.reload();
		};

		/* Insere atributo data-title nas células do corpo da tabela de acordo com o
		* título do cabeçalho da coluna a que pertence, este atributo é usado para a correta
		* aprsentação dos dados da tabela em telas pequena, modo serializado.
		*/
		var serialized = function(){
			element.each(function (tableIndex, element) {
				// Para cada cabeçalho (th)
				$(this).find('th').each(function (thIndex) {
					// Armazena o conteúdo (texto) da th
					var headingText = $(this).text();
					// Para cada linha (tr) da tabela
					$(element).find('tr').each(function (trIndex, tr) {
						// Para cada célula (td) da tabela cujo índice (posição relativa dentro da linha)
						// combine com o índice do cabeçalho (th) atual.
						// Define o atributo data-title com o valor do texto do cabeçalho.
						$(tr).children().eq(thIndex).attr('data-title', headingText);
					});
				});
			});
		};

         /* Reconstroi datatable desabilitando/habilitando funcionalidades
         * de acordo com o tamanho de tela
         */
        var redraw = function (containerWidth) {

			// containerWidth - parâmetro que determina o tamanho de tela atual
			/*
			* Para telas XS e que o seletor ".xs" não tenha sido inserido no elemento table
			* são feitas alterações nas configurações do datatable e link "Ver mais..."
			*/
			if (containerWidth === "xs" && !element.hasClass("xs")) {

				setSizeXS();
			}

			/*
			* Para telas SM (ou maiores) e que o seletor ".sm" não tenha sido inserido no elemento table
			* são feitas alterações nas configurações do datatable e link "Ver mais..."
			*/
			if (containerWidth === "sm" && !element.hasClass("sm")) {

				setSizeDefault();
			}
		};

        // Analisa o parâmetro options.paginate e ajusta as variávies necessárias para fazer
        // com que a paginação funcione conforme o esperado.
        // Em outras palavras, traduz o valor de options.paginate para os valores esperados
        // pelo plugin original.
        var paginateSetup = function () {
            var validPaginate = true;
            lengthChange = false;
            pageLength = 0;
            paging = true;

			// Se paginate === true (boolean), segundo a documentação, a paginação default será aplicada.
			// Se paginate === false (boolean) e for 'serverControl', isso implicaria mostrar toda
			// a tabela de uma só vez, o que é problemático atualmente, como relatado na
			// função de pipeline. Por isso, nessa situação, também se aplicará a paginação default.
			if (options.paginate === true ||
			    options.paginate === false && options.sourceType === 'serverControl') {
				// Força o valor default para a opção
				options.paginate = Datatable.prototype.defaults.paginate;
			}


            switch ($.type(options.paginate)) {

                case 'array':

                    if (options.paginate.length > 0) {
                        // @TODO testar se todos os valores são inteiros positivos?
                        // @TODO ordenar os valores informados de forma ascendente?

                        // Cria cópias de options.paginate
                        paginateValues = options.paginate.slice();
                        paginateLabels = options.paginate.slice();

						// Não permite que a opção "Todos" seja colocada no caso de serverControl.
						// Isso foi feito para evitar o 'bug' descrito na função de pipeline.
						if (options.sourceType !== 'serverControl') {
	                        // Acrescenta valores correspondentes a "todos"
							paginateValues.push(-1);
							paginateLabels.push("Todos");
						}
                        // Ativa a possibilidade de o usuário escolher o tamanho da página.
                        lengthChange = true;
                        // O tamanho inicial é a primeira das opções.
                        pageLength = options.paginate[0];

                    // Se foi passado um array vazio
                    } else {
                        validPaginate = false;
                    }
                    break;

                case 'number':
                    // Um número positivo
                    if (options.paginate > 0) {

                        pageLength = options.paginate;

                    // Zero
                    } else if (options.paginate === 0) {
                        // Desliga a paginação
                        paging = false;

                    // Um número negativo
                    } else {
                        validPaginate = false;
                    }

                    break;

                case 'boolean':
                    // Apenas 'liga' ou 'desliga' a paginação, mantendo tudo o mais como padrão
                    paging = options.paginate;
                    break;

                default:
                    validPaginate = false;
                    break;
            }

            if (!validPaginate) {
                console.warn ('Datatable: O valor informado para o parâmetro "paginate" é inválido: "' + options.paginate + '"\n' +
                              'Informe um array com conteúdo, um número positivo ou um valor booleano.\n' +
                              'Utilizando o valor default para "paginate".', element);
				// Fazendo aqui o que foi prometido no warning acima: utilizando o valor default.
				// Força o valor default para a opção, e chama novamente o setup.
				options.paginate = Datatable.prototype.defaults.paginate;
				paginateSetup();
            }
        };


		// Adiciona uma mensagem para o usuário na lista
		var pushUserMsg = function (type, text) {

			userMsgList.push({
				type: type,
				text: text
			});
		};

		// Transfere as mensagens para o usuário
		// da lista em memória para alerts na tela.
		// Se não houver mensagens em memória, não altera a tela.
		// Se houver, mostra na tela e apaga a memória.
		var displayUserMsgs = function () {

			var tableWrapper;
			// Se há mensagens em memória para o usuário
			if (userMsgList.length) {
				// Buscando referências dos elementos no DOM
				tableWrapper = $(table.table().container());

				if (userMsgContainer) {
					// Esvazia o container se ele existir
					userMsgContainer.empty();
				}
				else {
					// Cria o container se ele não existir
					userMsgContainer = $('<div></div>');
					userMsgContainer.prependTo(tableWrapper);
				}
				// Para cada mensagem em memória
				$.each(userMsgList, function(index, msg) {
					// Cria a mensagem dentro do container
					userMsgContainer.append("<div data-pic-alert='{\"type\": \""+msg.type+"\"}'>"+msg.text+"</div>");
				});
				// Faz a ativação do Alert usando o container como contexto
				PIC.activateWidget('Alert', userMsgContainer);
				// Limpa as mensagens em memória
                userMsgList = [];
            }
            PIC.refreshWidget("Actionsbar");
		};

		var handleDisplayConfig = function () {

			// Verifica e trata o caso de dados como array de objetos
			hasDisplayConfig = element.find('th').filterByConfig(name, 'display').length > 0;
			if (hasDisplayConfig) {
				columns = [];
				element.find("th").each(function(){
					if ($(this).filterByConfig(name, 'display').length) {
						var config = $(this).config(name);
						// sort e filter só podem ser aplicados se display tiver sido definido
						// sort e filter assumem o mesmo valor de display se não tiverem sido definidos.
						columns.push({
							data: {
								_: 		 config.display,
								display: config.display,
								sort: 	 config.sort   || config.display,
								filter:  config.filter || config.display
							}
						});
					} else if ($(this).filterByConfig(name, 'customcontent').length) {
						columns.push({
							data: null,
							defaultContent: ''
						});
					} else {
						// Aborta e avisa sobre o erro ocorrido (coluna sem configuração).
						console.warn(name + ': Parâmetro display quando informado, deve estar presente em todas as colunas da tabela. Parâmetro não passado na coluna ', $(this),
						'\n Instanciação do widget foi abortada ', element);
					}
				});
			}
		}

        /*
         * Implementação do plugin (o que o plugin faz ou estende ao comportamento de outro)
         */


        /*
        * Configurações da tabela
        */
       //API datatables - para inserção da paginação do bootstrap no datatables
        $.fn.dataTableExt.oApi.fnPagingInfo = function ( oSettings ) {
            return {
              "iStart":         oSettings._iDisplayStart,
              "iEnd":           oSettings.fnDisplayEnd(),
              "iLength":        oSettings._iDisplayLength,
              "iTotal":         oSettings.fnRecordsTotal(),
              "iFilteredTotal": oSettings.fnRecordsDisplay(),
              "iPage":          oSettings._iDisplayLength === -1 ?
                  0 : Math.ceil( oSettings._iDisplayStart / oSettings._iDisplayLength ),
              "iTotalPages":    oSettings._iDisplayLength === -1 ?
                  0 : Math.ceil( oSettings.fnRecordsDisplay() / oSettings._iDisplayLength )
            };
        };

		$.fn.dataTable.ext.errMode = 'none';

		/* Bootstrap estilo paginação */
        $.extend( $.fn.dataTableExt.oPagination, {
          "bootstrap": {
              "fnInit": function( oSettings, nPaging, fnDraw ) {
                  var oLang = oSettings.oLanguage.oPaginate;
                  var fnClickHandler = function ( e ) {
                      e.preventDefault();
                      if ( oSettings.oApi._fnPageChange(oSettings, e.data.action) ) {
                          fnDraw( oSettings );
                      }
                  };

                  $(nPaging).append(
                    '<ul class="pagination">'+
                          '<li class="prev disabled"><a href="#" tabindex="-1" aria-label="Anterior"><span class="glyphicon glyphicon-menu-left"></span> <span class="posicao">'+oLang.sPrevious+'</span></a></li>'+
                          '<li class="next disabled"><a href="#" tabindex="-1" aria-label="Próxima"><span class="posicao">'+oLang.sNext+'</span> <span class="glyphicon glyphicon-menu-right"></span> </a></li>'+
                    '</ul>'
                  );
                  var els = $('a', nPaging);
                  $(els[0]).bind( 'click.DT', { action: "previous" }, fnClickHandler );
                  $(els[1]).bind( 'click.DT', { action: "next" }, fnClickHandler );
              },

              "fnUpdate": function ( oSettings, fnDraw ) {
                  var iListLength = 5;
                  var oPaging = oSettings.oInstance.fnPagingInfo();
                  var an = oSettings.aanFeatures.p;
                  var i, j, sClass, sTabIndex, iStart, iEnd, iHalf=Math.floor(iListLength/2);

                  if ( oPaging.iTotalPages < iListLength) {
                      iStart = 1;
                      iEnd = oPaging.iTotalPages;
                  }
                  else if ( oPaging.iPage <= iHalf ) {
                      iStart = 1;
                      iEnd = iListLength;
                  } else if ( oPaging.iPage >= (oPaging.iTotalPages-iHalf) ) {
                      iStart = oPaging.iTotalPages - iListLength + 1;
                      iEnd = oPaging.iTotalPages;
                  } else {
                      iStart = oPaging.iPage - iHalf + 1;
                      iEnd = iStart + iListLength - 1;
                  }
                    var iLen;
                  for ( i=0, iLen=an.length ; i<iLen ; i++ ) {
                      // Remove the middle elements
                      $('li:gt(0)', an[i]).filter(':not(:last)').remove();

                      // Add the new list items and their event handlers
                      for ( j=iStart ; j<=iEnd ; j++ ) {
                          sTabIndex = (j==oPaging.iPage+1) ? 'tabindex="0"' : 'tabindex="-1"';
                          sClass = (j==oPaging.iPage+1) ? 'class="active"' : '';
                          $('<li '+sClass+'><a href="#"'+sTabIndex+'>'+j+'</a></li>')
                              .insertBefore( $('li:last', an[i])[0] )
                              .bind('click', function (e) {
                                    e.preventDefault();
                                    oSettings._iDisplayStart = (parseInt($('a', this).text(),10)-1) * oPaging.iLength;
                                    //oSettings._DisplayLength = 20;
                                    fnDraw(oSettings);
                                    element.find(".pagination")
											.children()
											.each( function () {
                                        		if ($(this).children().attr("tabindex") == "0") {
                                            		$(this).children().focus();
                                        		}
                                    		});
                              });
                      }

                      // Add / remove disabled classes from the static elements
                      if ( oPaging.iPage === 0 ) {
                          $('li:first', an[i]).addClass('disabled');
                          $('li:first', an[i]).children().attr('aria-disable', 'true');
                      } else {
                          $('li:first', an[i]).removeClass('disabled');
                          $('li:first', an[i]).children().attr('aria-disable', 'false');
                      }

                      if ( oPaging.iPage === oPaging.iTotalPages-1 || oPaging.iTotalPages === 0 ) {
                          $('li:last', an[i]).addClass('disabled');
                          $('li:last', an[i]).children().attr('aria-disable', 'true');
                      } else {
                          $('li:last', an[i]).removeClass('disabled');
                          $('li:last', an[i]).children().attr('aria-disable', 'false');
                      }
                  }
              }
          }
        });

		//
		// Função Pipelining do dataTables
		//
		$.fn.dataTable.pipeline = function (opts) {
			// Configuration options
			var conf = $.extend( {
				pages: 5,     // number of pages to cache
				url: '',      // script url
				data: null,   // function or object with parameters to send to the server
							  // matching how `ajax.data` works in DataTables
				method: 'POST', // Ajax HTTP method
				timeout: 10000
			}, opts );

			// Private variables for storing the cache
			var cacheLower = -1;
			var cacheUpper = null;
			var cacheLastRequest = null;
			var cacheLastJson = null;

			return function ( request, drawCallback, settings, f ) {
				var ajax          = false;
				var requestStart  = request.start;
				var drawStart     = request.start;
				var requestLength = request.length;
				var requestEnd    = requestStart + requestLength;

				if ( settings.clearCache ) {
					// API requested that the cache be cleared
					ajax = true;
					settings.clearCache = false;
				}
				else if ( cacheLower < 0 || requestStart < cacheLower || requestEnd > cacheUpper ) {
					// outside cached data - need to make a request
					ajax = true;
				}
				else if ( JSON.stringify( request.order )   !== JSON.stringify( cacheLastRequest.order ) ||
						  JSON.stringify( request.columns ) !== JSON.stringify( cacheLastRequest.columns ) ||
						  JSON.stringify( request.search )  !== JSON.stringify( cacheLastRequest.search )
				){
					// properties changed (ordering, columns, searching)
					ajax = true;
				}

				// Store the request for checking next time around
				cacheLastRequest = $.extend( true, {}, request );

				if (ajax) {
					// Need data from the server
					if ( requestStart < cacheLower ) {
						requestStart = requestStart - (requestLength*(conf.pages-1));

						if ( requestStart < 0 ) {
							requestStart = 0;
						}
					}

					cacheLower = requestStart;
					cacheUpper = requestStart + (requestLength * conf.pages);

					request.start = requestStart;
					request.length = requestLength*conf.pages;

					// Provide the same `data` options as DataTables.
					if ( $.isFunction ( conf.data ) ) {
						// As a function it is executed with the data object as an arg
						// for manipulation. If an object is returned, it is used as the
						// data object to submit
						var d = conf.data( request );
						if ( d ) {
							$.extend( request, d );
						}
					}
					else if ( $.isPlainObject( conf.data ) ) {
						// As an object, the data given extends the default
						$.extend( request, conf.data );
					}

					
					var ajaxOpts = {"type":     conf.method,
									"url":      conf.url,
									"timeout":	conf.timeout,
									"headers":  conf.headers,
									"data":     request,
									"dataType": "json",
									"cache":    false,
									"success":  function ( json ) {
										cacheLastJson = $.extend(true, {}, json);

										if ( cacheLower != drawStart ) {
											json.data.splice( 0, drawStart-cacheLower );
										}
										// @TODO @FIX
										// Há um problema nessa linha quando requestLength vale -1
										// (situação em que o usuário pediu para ver todas a tabela de uma vez).
										// O que acontece é que a última linha da tabela é "cortada" dos resultados
										// que são entregues ao datatable.
										// Por hora, foi desabilitada a opção de mostrar tudo quando for
										// serverControl, e o erro não se reproduzirá.
										// No futuro, quando mostrar toda a tabela voltar a ser uma opção possível
										// em serverControl, esse problema precisa ser corrigido.
										if ( requestLength >= -1 ) {
											json.data.splice( requestLength, json.data.length );
										}

										latestJson = json;

										drawCallback(json);
									}
					};

					settings.jqXHR = $.ajax(ajaxOpts)
									.fail(function(jqxhr, textStatus, error) {
										if(jqxhr.status === 0){
											if(error == "timeout"){
												console.log("Datatable: Tempo de espera encerrado.", element);
											}else{
												console.log("Datatable: Network Problem", element);
											}
										}else{
											console.log("Datatable - Status Code: "+ jqxhr.status+" "+ error ,element);
										}
									});

				}
				else {

					var json = $.extend( true, {}, cacheLastJson );
					json.draw = request.draw; // Update the draw for each response
					json.data.splice( 0, requestStart-cacheLower );
					json.data.splice( requestLength, json.data.length );

					latestJson = json;

					drawCallback(json);
				}
			};
		};

		/* Registra método na API do datatables para limpar os dados em pipelined
		* forçando um novo ajax
		*/
		$.fn.dataTable.Api.register( 'clearPipeline()', function () {
			return this.iterator( 'table', function ( settings ) {
				settings.clearCache = true;
			} );
		} );

		// Força a existência de um id sob controle do PIC, para facilitar o destroy.
        // (se a tabela não possui um id, o DataTable original acaba criando um de acordo com suas próprias regras).
        element.uniqueId();

        element.addClass("table-striped table-hover");

        /*
        * Adiciona class noSortable para as colunas cujo o desenvolvedor não queria sort
        */
        element.find('th').filterByConfig(name, 'nosort').addClass('noSortable');

        //Cria array com os targets das colunas que não serão filtradas
        var targetsUnfiltered = [];

        element.find('th').filterByConfig(name, 'nofilter').each(function () {
            targetsUnfiltered.push($(this).index());
        });


        paginateSetup();

        /*
         * Instanciação do plugin que está sendo estendido
         */

		/*
		 *	Instancia biblioteca moment.js, plugin cujo objetivo é gerenciar padrões
		 *	mundiais de data e hora de acordo com a localização, neste caso
		 * 	de acordo com o padrão dia/mês/ano
		 */

		// Define os formatos reconhecidos por default
		$.fn.dataTable.moment('DD/MM/YYYY');
		$.fn.dataTable.moment('DD/MM/YYYY HH:mm:ss');
		$.fn.dataTable.moment('DD-MM-YYYY HH:mm:ss');

		// Inclui função para detecção de html (para tags que representam um elemento vazio)
		// Um elemento vazio é aquele que não possui nós filhos (https://developer.mozilla.org/en-US/docs/Glossary/Empty_element)
		// Isso foi necessário porque: o plugin 'moment', ao fazer a verificação de tipo da coluna, faz o seguinte:
		// - Ignora as tags HTML
		// - Verifica o conteúdo para ver se é uma data
		// - Considera que "vazio" é também data
		// Assim, o moment acaba considerando que esse tipo de tag (que, ao ser ignorada, resulta em "vazio")
		// é uma data. E isso faz com que o comportamento de ordenação/filtro não seja o esperado
		$.fn.dataTable.ext.type.detect.unshift( function ( data ) {
			var regExp = /<[^>]+?\/?[ ]*>/,
				elems = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'],
				tag;

			// Retorna 'html' se o conteúdo da célula (data) for uma das tags em elems.
			if (data) {
				tag = data.match(regExp);
				if (tag) {
					tag = tag[0].substr(0,tag[0].indexOf(' ')).replace("<","");
					return elems.indexOf(tag) != -1 ? 'html' : null;
				}
			}
			return null;
		} );

		// Obtém formatos personalizados informados por parâmetro
		if (options.datePatterns.length) {
			if ($.isArray(options.datePatterns)) {
				$.each(options.datePatterns, function(index, item) {
					if (typeof item === "string") {
						$.fn.dataTable.moment(item);
					}
				});
			}
			else {
				$.fn.dataTable.moment(options.datePatterns);
			}
		}

		/*
		* Definições de parâmetros que serão enviados ao datatables
		* de acordo com o tipo de tabela
		*/

		if (options.sourceType !== 'inline' && !options.source) {
			console.warn(name + ': Quando sourceType="'+ options.sourceType +'", é necessário informar também o parâmetro "source".\n',
                         'Não foi possível iniciar corretamente o widget no elemento ', element);
		}

		 //Verifica se o parâmetro requestHeaders é um Json válido
		 if (options.requestHeaders) {
			try {
				// Faz o parse do conteúdo obtido
				options.requestHeaders = JSON.parse(JSON.stringify(options.requestHeaders));
			}
			// Caso aconteça algum erro no parser:
			catch (exception) {
				// Força string vazia
				options.requestHeaders =  Datatable.prototype.defaults.requestHeaders;
				// Avisa sobre o erro ocorrido.
				console.warn(name + ': O valor informado no parâmetro requestHeaders não é um JSON válido.\n',
							'Será utilizado o valor default para esse parâmetro no elemento ', element);
			}
		}

		switch(options.sourceType) {
			case 'serverControl':
				element.addClass("serverControl");
				element.addClass("table-serialized");
				serverSide = true;
				ajaxOptions =
						$.fn.dataTable.pipeline({
							url: 		options.source,
							headers: 	options.requestHeaders,
							pages: 		3,
							method: 	"POST"
						});
				searchDelay = 400;
				rowId = "picRowId";
				datatableControls = datatableControls;
				handleDisplayConfig();
			break;
			case 'serverData':
				element.addClass("serverData");
				element.addClass("table-serialized");
				serverSide = false;
				ajaxOptions =
						{
							"url": 		options.source,
							"headers": 	options.requestHeaders,
							"type": 	"GET"
						};
				handleDisplayConfig();
			break;
			case 'inline':
				element.addClass("inline");
				element.addClass("table-serialized");
				serverSide = false;
				ajaxOptions = false;
				element.find('td').each(function(){
					var config = $(this).config(name);
					if ($(this).filterByConfig(name, 'sort').length) {
						$(this).attr('data-sort', config.sort);
					}
					if ($(this).filterByConfig(name, 'filter').length) {
						$(this).attr('data-filter', config.filter);
					}
				});
			break;
			case 'data':
				element.addClass("table-serialized");
				serverSide = false;
				ajaxOptions = false;
				jsonData = options.source;

				if (!Array.isArray(jsonData)) {
					console.warn(name + ": Parâmetro source não foi informado no formato esperado (array).", element);
					return;
				}
				handleDisplayConfig();
			break;
		}

		/*
		* Faz busca no cabeçalho da tabela para identificar quais colunas são tipo customcontent
		* e quais colunas que terão suas células alimentadas com dados remotos,
		* então cria array que será passado para o datatables informando qual tipo de dado
		* sera inserído de acordo com a coluna, remoto ou customizado.

		* Também define true a flag hasCustom caso encontre coluna do tipo customContente
		* no cabeçalho da tabela
		*/
		element.find("th").each(function(){
			if($(this).filterByConfig(name, 'customcontent').length){
				var index = $(this).index();
				hasCustom = true;
				arrPosAttrs.push({"data": null, "defaultContent": "&nbsp"});
			}else{
				arrPosAttrs.push({"data": indexColumnRemote});
				indexColumnRemote++;
			}
		});

		// Determina o valor do parâmetro de configuração 'order' utilizado pelo plugin Datatable,
		// de acordo com a configuração feita no widget.
		var getOrderConfig = function () {

			var order = [[0, 'asc']];

			// Para cada coluna da tabela (cabeçalho em thead),
			// verifica se possui a configuração de ordenação, e armazena o primeiro encontrado.
			element.find('thead th').each(function (index) {

				// Testa primeiro se possui a configuração 'asc'
				if ($(this).filterByConfig(name, 'asc').length) {
					order = [[index, 'asc']];
					return false; // Interrompe o 'each'
				}
				// Se não tiver, testa se possui a configuração 'desc'
				else if ($(this).filterByConfig(name, 'desc').length) {
					order = [[index, 'desc']];
					return false; // Interrompe o 'each'
				}
			});

			return order;
		};

		/*
		*	Cria link ou botão que ao ser disparado permite a
		*	visualização dos itens da tabela, 10 itens por vez
		*/
		var viewMore = function () {

			var remainingItems,
				// Objeto table
				table = element.dataTable(),
				// Configurações do objeto table
                tableSettings = table.fnSettings(),
				dataTableWrapper = element.closest(".dataTables_wrapper");

			/*
			* Se o número de itens exibidos(fnRecordsDisplay) for igual ao número total de itens(fnRecordsTotal) da tabela
			* a quantidade de itens restantes será igual ao total subtraindo a quantidade já exibida(fnDisplayEnd)
			*/
			if (tableSettings.fnRecordsDisplay() === tableSettings.fnRecordsTotal()) {
				remainingItems = tableSettings.fnRecordsTotal() - tableSettings.fnDisplayEnd();
			/*
			* Senão a quantidade de itens restantes será igual a quantidade de itens que podem ser exibidos
			* subtraido a quantidade de itens já exibidos
			*/
			}
			else {
				remainingItems = tableSettings.fnRecordsDisplay() - tableSettings.fnDisplayEnd();
			}

			/*
			* Como o valor que deve ser apresentado no label do link ou botão deve ser sempre 'Ver mais <XS_PAGE_LENGTH>',
			* no caso da quantidade de itens restantes ser igual ou maior que XS_PAGE_LENGTH,
			* remainingItems será igual a XS_PAGE_LENGTH
			*/
			if (remainingItems >= XS_PAGE_LENGTH) {
				remainingItems = XS_PAGE_LENGTH;
			}

			/*
			* Caso ainda não exista é criado link com label "Ver mais ..." somente em telas pequenas
			*/
			/*
			* Se o seletor lnkLoadMore não for encontrado no segundo elemento após a tabela
			* e se ainda existir itens para serem exibidos, ou seja, remainingItems maior que zero
			*/
			if (dataTableWrapper.find(".lnkLoadMore").length === 0 && remainingItems > 0) {
				element.parent().parent().after("<div class=\"lnkLoadMore\">"+
				"<a href=\"#\"><span class=\"glyphicon glyphicon-refresh\"></span>"+
				"Ver mais " + remainingItems +"</a></div>");

				/*
				* Inserido listener no link para que no evento click sejam exibidos os
				* próximos XS_PAGE_LENGTH itens seguintes aos que já foram exibidos.
				* E através do método fnDraw(tableSettings) com a passagem de novas configurações
				* estabelecidas para o datatable é feito a rescontrução da mesma.
				*/
				dataTableWrapper.find(".lnkLoadMore").on('click'+eventNamespace, function(e) {
					/*
					* Soma XS_PAGE_LENGTH ao número de ítens que já foram exibidos e atribui este
					* valor ao número de itens que devem ser exibidos por página(_iDisplayLength)
					*/
					tableSettings._iDisplayLength = tableSettings.fnDisplayEnd() + XS_PAGE_LENGTH;

					if (options.sourceType === "serverControl" || options.sourceType === "serverData"){
						reload();
					}
					else {
						table.fnDraw();
					}
					e.preventDefault();
				});
			/*
			* Se o link já existe é necessário apenas a alteração dos dados da sua label
			* de acordo com a quantidade de itens que ainda faltam a serem exibidos
			*/
			} else {
				// Se ainda exitem itens para serem exibidos permito a alteração da label do link
				if (remainingItems > 0) {
					dataTableWrapper.find(".lnkLoadMore").children().first().html("<span class=\"glyphicon glyphicon-refresh\"></span> Ver mais " + remainingItems +"");
				// Senão o link é removido
				} else {
					dataTableWrapper.find(".lnkLoadMore").remove();
				}
			}
		};


		var setSizeXS = function (refresh) {

				// Objeto table
			var table = element.DataTable(),
				// Informações de linguagem (usando modelo antigo do Datatable,
				// já que o novo não permite esse tipo de acesso às configurações)
				oLanguage = element.dataTable().fnSettings().oLanguage,
				dataTableWrapper = element.closest(".dataTables_wrapper");

			// Parâmetro refresh é 'true' por padrão
			refresh = refresh !== undefined ? refresh : true;

			/*
			* Para que esta condição seja satisfeita apenas uma vez é inserido um seletor na tabela
			* com a mesma nomenclatura da largura de tela atual, neste caso 'xs'
			*/
			// Remove seletor inserido em telas 'sm' e
			// insere seletor para o tamanho de tela atual 'xs'
			element
				.removeClass("sm")
				.addClass("xs");

			/*
			* Alterações de visibilidade e na grid do bootstrap são necessárias
			* para apresentação do link em telas xs
			*/
			// dataTableWrapper.find(".dataTables_length").addClass("hidden-xs visible-sm visible-md visible-lg");
			// dataTableWrapper.find(".dataTables_info").removeClass("col-sm-3").addClass("col-xs-12");
			// dataTableWrapper.find(".dataTables_paginate").addClass("hidden-xs visible-sm visible-md visible-lg");

			// Configurações necessárias para o datatable neste tamanho de tela
			// Quantidade de itens para serem exibidos por página, valor inicial
			table.page.len(XS_PAGE_LENGTH);
			// Apresenta na legenda quantos itens já foram exibidos do total a ser exibido
			oLanguage.sInfo = "Exibido(s) <b>_END_</b> de <b>_TOTAL_</b> itens";

			// Reconstroi tabela e passa novas configurações
			if (refresh) {

				if (options.sourceType !== "serverControl" && options.sourceType !== "serverData") {
					table.draw();
				}
				else {
					reload();
				}
			}

			// Cria link 'Ver mais...'
			viewMore();

			// Inicia listener no draw do datatable para que o link "Ver mais..."
			// possa ser alterado de acordo com o intens exibidos e quantos ainda faltam
			element.on('draw.dt.xs'+eventNamespace, function () {
				viewMore();
			});
		};

		var setSizeDefault = function (refresh) {

				// Objeto table
			var table = element.DataTable(),
				// Informações de linguagem (usando modelo antigo do Datatable,
				// já que o novo não permite esse tipo de acesso às configurações)
				oLanguage = element.dataTable().fnSettings().oLanguage,
				dataTableWrapper = element.closest(".dataTables_wrapper");

			// Parâmetro refresh é 'true' por padrão
			refresh = refresh !== undefined ? refresh : true;

			/*
			* Para que esta condição seja satisfeita apenas uma vez é inserido um seletor na tabela
			* com a mesma nomenclatura da largura de tela atual, neste caso 'sm'
			*/
			// Remove seletor inserido em telas 'xs'
			// e insere seletor para o tamanho de tela atual 'sm'
			element
				.removeClass("xs")
				.addClass("sm");

			/*
			* Alterações de visibilidade e na grid do bootstrap são necessárias
			* para apresentação do link em telas sm
			*/
			//element.next(".pagination").children().first().removeClass("col-xs-12").addClass("col-sm-3");

			/*
			* Desliga listener para draw do datatable, somente deve ser usado
			* em telas pequenas já que o forma que é feita a paginação é diferenciada
			*/
			element.off('draw.dt.xs'+eventNamespace);

			// Configurações necessárias para o datatable neste tamanho de tela
			// Altera informações na legenda do datatable
			oLanguage.sInfo = "De _START_ até _END_ de _TOTAL_ itens";
			// Quantidade de itens para serem exibidos por página
			// tableSettings._iDisplayLength = parseInt(pageLength);
			table.page.len(pageLength);

			// Reconstroi tabela e passa novas configurações
			if (refresh) {

				if (options.sourceType !== "serverControl" && options.sourceType !== "serverData") {
					table.draw();
				}
				else {
					reload();
				}
			}

			/*
			* Remove link ("Ver mais...") pois em telas sm e maiores a paginação
			* usada é a default do datatable
			*/
			dataTableWrapper.find(".lnkLoadMore").remove();

		};

		var instanceDatatables = function() {

			var liveBox,
				orderConfig = getOrderConfig();

			element.css("width", "100%");

			table = element
			.on('init.dt'+eventNamespace, function () {

				var dataTableWrapper = element.closest(".dataTables_wrapper");

				dataTableWrapper.find(".dataTables_length").addClass("hidden-xs visible-sm visible-md visible-lg");
				dataTableWrapper.find(".dataTables_info").removeClass("col-sm-3").addClass("col-xs-12");
				dataTableWrapper.find(".dataTables_paginate").addClass("hidden-xs visible-sm visible-md visible-lg");

				// Se a largura atual da tela for XS
				if (PIC.isXS($(window).width())) {

					setSizeXS(false);
				}
				else {
					setSizeDefault(false);
				}

			})
			// Controla spinning
			.on('processing.dt'+eventNamespace, function (e, settings, processing) {
				if (processing) {
					element.closest('.row').removeClass("idle").addClass("busy");
				}
				else {
					element.closest('.row').removeClass("busy").addClass("idle");
				}
			})
			// Desativa mensagem de warning no alert e para para o console
			.on('error.dt'+eventNamespace, function ( e, settings, techNote, message ) {
				if (techNote === 4) {
					console.warn(name + ": A quantidade de colunas inserida é menor que a quantidade de colunas da tabela.", element);
				}
			})
			.DataTable({
				"serverSide": serverSide,
				"ajax": ajaxOptions,
				"createdRow": function( row, data, dataIndex ) {
					$(row).attr('id', data.picRowId);
					$(row).data('rowdata', data.picRowData);
				},
				"rowId": rowId,
				"searchDelay": searchDelay,
				"dom": datatableControls,
				// Habilita/desabilita a ordenação
				"ordering": options.sort,
				// Determina qual é a ordenação inicial.
				"order": orderConfig,
				// Habilita/desabilita a paginação
				"paging": paging,
				// Determina a quantidade de elementos por página
				// (Somente tem efeito se paging = true)
				// Se iniciar em tela estreita, fixa tamanho em XS_PAGE_LENGTH
				"pageLength": PIC.isXS($(window).width()) ? XS_PAGE_LENGTH : pageLength,
				// Habilita/desabilita possibilidade de o usuário final escolher de número de linhas a exibir.
				// (Somente tem efeito se paging = true)
				"lengthChange": lengthChange,
				// Define as opções, disponíveis para o usuário final, de número de linhas a exibir
				"lengthMenu": [paginateValues, paginateLabels],
				// Define o estilo dos controles de paginação
				// "bootstrap" é definido por um plugin de DataTables.
				"pagingType": "bootstrap",
				// Habilita/desabilita o filtro
				"searching": options.filter,
				"data": jsonData,
				"columns": columns ? columns : arrPosAttrs,
				// Definições para colunas específicas
				"columnDefs": [
					{
						// Colunas com a classe 'noSortable' não são ordenáveis
						"targets": "noSortable",
						"orderable": false
					},
					{
						// Colunas cujos índices estão em targetsUnfiltered não são pesquisáveis
						"targets": targetsUnfiltered,
						"searchable": false
					}
				],
				"drawCallback": function( settings ) {

					var api = this.api();

					// Essa chamada estava antes no evento 'draw.dt'. Mas com a criação de sourceType=data,
					// foi necessário trazê-lo para cá. Porque o evento não é disparado na criação da instância do DataTables,
					// e essa chamada passou a fazer falta (não fazia falta para outros sourceType, com ciclos de vida
					// ligeiramente diferentes).
					serialized();

					if(api.page.info().recordsDisplay === 0){
						element.find(".dataTables_empty").remove();
						if(!$(api.table().container()).find("div.zeroRecords").length){
							element.after("<div class=\"zeroRecords\">Não foram encontrados resultados para esta pesquisa.</div>");
						}
					}else{
						$(api.table().container()).find("div.zeroRecords").remove();
					}
				},
				//Tradução
				"language": {
					"decimal": ",",
					"thousands": ".",
					"aria": {
						"sortAscending": " - acione para ordenar de forma ascendente",
						"sortDescending": " - acione para ordenar de forma descendente"
					},
					"search": "Pesquisar por: ",
					"emptyTable": "Não foram encontrados dados para esta tabela.",
					"lengthMenu": "Exibir _MENU_ por página",
					"info": "De _START_ até _END_ de _TOTAL_ itens",
					"zeroRecords": "Não foram encontrados resultados para esta pesquisa.",
					"infoEmpty": "Nenhum item listado",
					"infoFiltered": " - de um total de _MAX_ itens",
					"paginate": {
						"first": "Primeira página",
						"next": "Próxima",
						"previous": "Anterior",
						"last": "Última página"
					}
				}
			})
			.on('search.dt'+eventNamespace, function (e) {
				// Quando uma pesquisa é feita e o usuário não está na primeira página,
				// o plugin Datatable forçará automaticamente a volta para a primera página
				if (table.page() !== 0) {
					pushUserMsg("warning", "Tabela reposicionada na primeira página");
				}
			})
			.on('draw.dt'+eventNamespace, function () {

				// Sempre que a tabela sofrer alguma ação, como:
				// mudança no tamanho da página, pesquisa, ordenação, paginação...
				// esse evento será disparado.
				// E então as mensagens mais recentes para o usuário serão mostradas.
				displayUserMsgs();

				element.triggerHandler('pic:beforedraw', [latestJson]);
				element.triggerHandler('pic:beforeshow', [latestJson]);

				// Armazena o índice da última página exibida, para posterior controle
				// de mensagens de mudança automática de página.
				lastDrawnPage = table.page.info().page;
			})
			.on('length.dt'+eventNamespace, function() {
				// Quando o usuário modifica o tamanho da página, e o usuário não estava
				// vendo a primeira página, força o retorno à primeira página
				// Note que aqui é necessário o uso da variável auxiliar lastDrawnPage porque
				// quando esse evento é disparado, o plugin Datatable já informa a página
				// nova (para o qual o usuário será direcionado), e não a que ele estava antes.
				if (lastDrawnPage !== 0) {
					table.page('first').draw('page');
					pushUserMsg("warning", "A tabela foi reposicionada na primeira página");
				}
			});

			// Adiciona classe livebox no wrapper do datatable para execução do spinner;
			liveBox = $(table.table().container()).find(".dataTable").closest(".row").addClass( 'liveBox' );
			liveBox.addClass( 'liveBox' );
			liveBox.append("<div class=\"maskLoaderPic invert\"><div class=\"loaderPic spinPeq\"></div></div>");

			/*
			* Insere listner no resize da janela para monitorar o tamanho de tela
			* pois de acordo com o tamanho de tela/disposivo o comportamento
			* e modo de apresentação do datable é diferenciado
			*/
			$(window).on('resize'+eventNamespace, function() {
				/*
				* De acordo com as condições colocadas abaixo é executada função rDrawDatatable(),
				* responsavel pela recontrução e reconfiguração do datatable de acordo com o
				* tamanho de tela que é passado como parâmetro, xs telas pequenas e sm
				* telas small e superiores
				*/
				if (PIC.isXS($(window).width())) {
					redraw("xs");
				}
				else {
					redraw("sm");
				}
			});

			/*
			* Insere interação com teclado na paginação do dataTables
			*/
			element.closest(".dataTables_wrapper").find('.dataTables_paginate')
				.on("keydown"+eventNamespace, ".pagination li", function (e) {

				var keyCode = e.which;

				if (keyCode === key.right || keyCode === key.down) {
					e.preventDefault();
					if ($(this).next().index() === -1) {
						$(this).parent().children().first().children().focus();
					} else {
						$(this).next().children().focus();
					}
				} else if (keyCode === key.left || keyCode === key.up) {
					e.preventDefault();
					if ($(this).index() === 0) {
						$(this).parent().children().last().children().focus();
					} else {
						$(this).prev().children().focus();
					}
				}
			});
		};

		// Se não forem encontradas colunas do tipo customcontent na tabela, datatables é instanciado
		if (!hasCustom) {
			instanceDatatables();
		}

		//Insere espaço em branco em células sem conteúdo
		element.find("td:empty").html("&nbsp");

        // Expondo os métodos públicos
		if (options.sourceType === 'serverControl' || options.sourceType === 'serverData') {
			api = {
				destroy: destroy,
				remove: remove,
				insert: insert,
				loadData: loadData,
				reload: reload
			};
		}
		else if (options.sourceType === 'data') {
			api = {
				destroy: destroy,
				remove: remove,
				insert: insert,
				loadData: loadData
			};
		}
		else {
			api = {
				destroy: destroy,
				remove: remove,
				insert: insert
			};
		}

        $.extend(this, api);
    };

    Datatable.prototype = {

        name: 'Datatable',

        defaults: {
            filter: true,
            sort: true,
            paginate: [10, 20, 50],
			datePatterns: "",
			sourceType: "inline",
			source: false,
			requestHeaders: ""
		},
        domains: {
            filter: [true, false],
            sort: [true, false],
			sourceType: ["inline", "serverControl", "serverData", "data"]
        }
    };

    /*
     * Solicita o registro do plugin
     */
    PIC.widgetRegister(Datatable);

})(jQuery, window, document);
})();
/* Início de novo arquivo concatenado */
(function () {/* Collapsible */
/**
Permite que um conteúdo possa ser recolhido (ocultado) ou exibido ao clicar no título associado.

O título deve ser marcado com a classe `collapsibleTitle`.

O conteúdo deve ser marcado com a classe `collapsibleContent`.

@module Collapsible
@attribute data-pic-collapsible
@param {boolean} [collapse=false] - Indica se o conteúdo estará inicialmente recolhido. O padrão é não recolhido (mostrado).
@example
<div data-pic-collapsible>
    <h2 class="collapsibleTitle">
        Conteúdo adicional
    </h2>
    <div class="collapsibleContent">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    </div>
</div>
*/
;(function ($, window, document, undefined) {

    'use strict';

    /*
     * Definição da classe
     */
    var Collapsible = function (widgetHelper) {

        /*
         * Variáveis de instância
         * Defina todas aqui antes de usar
         */
        var name = this.name,
            element = widgetHelper.element,
            options = widgetHelper.options,
            eventNamespace = widgetHelper.eventNamespace,
            title,
            content,
            idTitle,
            idContent;


        /*
         * Métodos públicos
         */
        this.destroy = function () {

            // Remover listener de eventos
            widgetHelper.clearEvents();

            // Remover atributos e classes de title e content
            title
                .removeAttr('data-toggle data-target aria-expanded role aria-controls tabindex')
                .removeClass('closed opened collapsed');
            content
                .removeAttr('aria-hidden aria-labelledby role style')
                .removeClass('collapse in');

            // Remover ids criados
            content.removeUniqueId();
            title.removeUniqueId();

        };

        /*
         * Métodos privados
         */
        
        // Listener do evento show (ao abrir o collapsible)
        var onShow = function () {
            
            // Marca title como aberto e content como mostrado
            title
                .addClass("opened")
                .removeClass("closed");
                
            content.attr("aria-hidden", "false");
                
        };
        
        // Listener do evento hide (ao fechar o collapsible)
        var onHide = function () {
            
            // Marca title como fechado e content como escondido
            title
                .addClass("closed")
                .removeClass("opened");

            content.attr("aria-hidden", "true");
        };

        // Corrige atributo aria-expanded
        var fixAreaExpanded = function () {
            // Bootstrap adiciona erroneamente esse atributo ao content,
            // por isso ele é removido aqui.
            content.removeAttr('aria-expanded');
        };

        /*
         * Implementação do plugin (o que o plugin faz ou estende ao comportamento de outro)
         */

        title = element.find(".collapsibleTitle");
        content = element.find(".collapsibleContent");

        //* Insere dinamicamente os ids no Title e Content
        title.uniqueId();
        idTitle = title.attr("id");
        content.uniqueId();
        idContent = content.attr("id");

        // Insere os atributos necessários para o funcionamento do Collapsible (do Bootstrap)
        // e outros atributos de acessibilidade.
        title.attr({
            "data-toggle": "collapse",
            "data-target": "#"+idContent,
            "role": "tab",
            "aria-controls": idContent,
            "tabindex": 0
        });
        
        content
            .addClass('collapse')
            .attr({
                "role": "tabpanel",
                "aria-labelledby": idTitle
            });
        

        // Se deve iniciar fechado (collapsed)
        if (options.collapse) {

            title
                .attr("aria-expanded", "false")
                .addClass("closed");

            content.attr("aria-hidden","true");

        // Se deve iniciar aberto
        } else {

            title
                .attr("aria-expanded","true")
                .addClass("opened");

            content
                .attr("aria-hidden","false")
                .addClass("in");
        }
        
        
        // Eventos
        
        // Permite controlar o collapsible pelo teclado
        title.on("keydown"+eventNamespace, function (e) {
            
            if (e.which == key.enter) {
                // Se foi pressionado enter, alterna o estado do collapsible
                content.collapse('toggle');
            }
        });
        
        content
            .on('show.bs.collapse' + eventNamespace, onShow)
            .on('hide.bs.collapse' + eventNamespace, onHide)
            .on('shown.bs.collapse' + eventNamespace, fixAreaExpanded)
            .on('hidden.bs.collapse' + eventNamespace, fixAreaExpanded);

    };

    Collapsible.prototype = {

        name: 'Collapsible',

        defaults: {
            collapse: false
        },

        domains: {
            collapse: [true, false]
        }
    };

    /*
     * Solicita o registro do widget
     */
    PIC.widgetRegister(Collapsible);

})(jQuery, window, document);

})();
/* Início de novo arquivo concatenado */
(function () {/* Tooltip */
/**
Adiciona informações adicionais aos elementos marcados com data-pic-tooltip.

Essas informações podem ser um texto simples ou um `HTML`.
 * Para texto simples, use o parâmetro `text`.
 * Para `HTML`, use o parâmetro `sourceId`:
   coloque o conteúdo desejado na página, em um contêiner (como um `div`) com o atributo `id` definido. Informe esse `id` como valor desse parâmetro.
_Atenção: é preciso informar um desses dois parâmetros para que o widget possa funcionar._

@module Tooltip
@attribute data-pic-tooltip
@param {string} [text] - Texto a ser mostrado no tooltip. Se informado, `sourceId` será ignorado.
@param {string} [sourceId] - Valor do atributo `id` do contêiner do trecho de `HTML` que será mostrado no tooltip.
@param {string|array} [trigger=["hover","focus"]] - Como o tooltip será disparado.
       O valor `manual` não pode ser combinado com os demais; se for informado, os demais disparadores serão ignorados.
       Com disparador `manual`, use os métodos `show()` e `hide()` para controlar a visibilidade do tooltip.
       Para informar vários disparadores, utilize um array.
       Valores possíveis: hover|focus|manual.
@param {number} [delay=0] - Tempo (em milissegundos) que deve transcorrer entre o elemento ganhar o foco e o tooltip ser exibido.
       Note que isso afeta apenas a exibição disparada pelo *foco* (ou seja, não afeta hover nem manual).
@example
<!-- Usando texto simples -->
<span data-pic-tooltip='{"text": "Aqui deve estar o texto do meu Tooltip e eu não quero que ele ajuste o tamanho"}'>Tooltip Texto</span>

<!-- Usando HTML -->
<span data-pic-tooltip='{"sourceId": "tooltipHtml"}'>Tooltip Html</span>

<div id="tooltipHtml">
    <b>Texto Negrito</b>
    <h1>Texto Título</h1>
</div>
*/
;(function ($, window, document, undefined) {

    'use strict';

    /*
     * Definição da classe
     */
    var Tooltip = function (widgetHelper) {

        /*
         * Variáveis de instância
         * Defina todas aqui antes de usar
         */
        var name = this.name,
            element = widgetHelper.element,
            options = widgetHelper.options,
            eventNamespace = widgetHelper.eventNamespace,
            source,
            originalTitle,
            originalTabindex,
            validParams = false,
            timeOut,
            shown = false,
            inState = {
                hover: false,
                focus: false,
            };

        /*
         * Métodos
         */
        
        var destroy = function () {

            // Somente tem coisas a desfazer se os parâmetros eram válidos na ativação
            if (validParams) {                
                hide();

                widgetHelper.clearEvents();

                // Destrói o popover (bootstrap)
                element.popover('destroy');

                // Se foi usado o parâmetro sourceId
                if (source && source.length) {
                    source
                        .removeClass('tooltip')
                        .removeAttr('aria-hidden');
                }

                // Retira 'data-original-title' que é criado (mas não removido) pelo popover do Bootstrap.
                element.removeAttr('role data-original-title');
                
                // Retorna o atributo 'title' a seu valor original.
                if (originalTitle === undefined) {
                    element.removeAttr('title');
                }
                else {
                    element.attr('title', originalTitle);
                }
                
                // Retorna o atributo 'tabindex' a seu valor original.
                if (originalTabindex === undefined) {
                    element.removeAttr('tabindex');
                }
                else {
                    element.attr('tabindex', originalTabindex);
                }
            }
        };

        /**
         * Mostra o tooltip.
         * 
         * Não tem nenhum efeito se o tooltip já estiver sendo exibido.
         *
         * @method show
         * @instance
         */
        var show = function () {

            // Se já estiver exibido, não faz nada.
            if (shown) {
                return;
            }
            
            element.popover('show');

            if (source) {
                source.attr("aria-hidden", "false");
            }
        };

        /**
         * Esconde o tooltip.
         * 
         * Não tem nenhum efeito se o tooltip não estiver sendo exibido
         *
         * @method hide
         * @instance
         */
        var hide = function () {
            
            // Limpa o timeout (se houver).
            clearTimeout(timeOut);

            if (source) {
                source.attr("aria-hidden", "true");
            }
            
            element.popover('hide');
        };
        
        // Has 'in' state? 
        // Quando o tooltip recebe o mouse (hover) ou o foco, isso fica registrado.
        // Essa função responde se, nesse momento, há houver ou foco no tooltip.
        // Esse controle é necessário para lidar com cenários como:
        // 1. O tooltip recebe o foco (e é mostrado);
        // 2. O usuário coloca o mouse sobre o tooltip (não tem efeito, já que ele já está sendo mostrado);
        // 3. O usuário tira o mouse do tooltip.
        // Nesse terceiro passo é que esse controle se mostra necessário, porque a retirada do mouse
        // do tooltip (mouseleave) provocaria sua ocultação. Mas, como o foco ainda está lá, ele
        // continua sendo exibido.
        var hasInState = function () {
            var trigger;
            for (trigger in inState) {
                if (inState[trigger]) {
                    return true;
                }
            }
            return false;
        };
        
        // Indica que houve a 'entrada' no tooltip, ou seja, que ele recebeu foco ou hover.
        // Essa função controla o inState e pode pedir que o tooltip seja mostrado.
        var enter = function (trigger, delay) {
            
            // Se delay não foi informado, assume zero (sem delay)
            delay = delay || 0;
            
            // Se existe um delay
            if (delay) {
                // Agenda a entrada para depois do delay.
                timeOut = setTimeout(function () {
                    enter(trigger);
                }, delay);
            }
            else {
                // Grava a 'entrada' do trigger em questão
                inState[trigger] = true;
                // Pede para mostrar o tooltip.
                show();
            }
        };
        
        // Indica que houve a 'saída' do tooltip, ou seja, que ele perdeu foco ou hover.
        // Essa função controla o inState e pode pedir que o tooltip seja escondido.
        var leave = function (trigger) {
            
            // Apaga a 'entrada' do trigger em questão
            inState[trigger] = false;
            
            // Limpa o timeout (se houver).
            clearTimeout(timeOut);
            
            // Se não há registro de 'entrada' de nenhum trigger, esconde
            if (!hasInState()) {
                hide();
            }
        };

        // Verifica a validade dos parâmetros informados
        var validateParams = function (text, sourceId, trigger, delay) {
            
            // Se não foi informado nem text nem sourceId
            if (!text && !sourceId) {
                // Aborta a execução
                console.warn('Erro ao ativar o widget Tooltip para o elemento: ', element, '\n' +
                             'Informe um dos parâmetros necessários (text ou sourceId).');
                return false;
            }

            // Se foi informado somente sourceId
            // Por que 'somente' sourceId? Porque não se espera que os dois sejam informados mas,
            // se isso acontecer, o parâmetro 'text' terá prioridade.
            if (!text && sourceId) {

                // Mas se não existe elemento na página com o id informado
                if ($('#' + sourceId).length === 0) {
                    // Aborta a execução
                    console.warn('Erro ao ativar o widget Tooltip para o elemento: ', element, '\n' +
                                 'O parâmetro sourceId (' + sourceId + ') não corresponde a um elemento da página.');
                    return false;
                }
            }

            // 'trigger' deve ser um string ou um array
            if ($.type(trigger) !== 'string' && $.type(trigger) !== 'array') {
                console.warn('Erro ao ativar o widget Tooltip para o elemento: ', element, '\n' +
                             'O parâmetro trigger (' + trigger + ') deve ser um string ou array.');
                return false;
            }

            // 'delay' deve ser entendido como number e não pode ser um string vazio
            if ($.type(parseInt(delay)) !== 'number' || delay === '') {
                console.warn('Erro ao ativar o widget Tooltip para o elemento: ', element, '\n' +
                             'O parâmetro delay (' + delay + ') deve ser numérico.');
                return false;
            }

            return true;
        }

        // Inicializa o widget.
        var init = function () {

            var trigger = options.trigger,
                delay = options.delay,
                text = options.text,
                sourceId = options.sourceId;

            /*
             * Implementação do plugin (o que o plugin faz ou estende ao comportamento de outro)
             */

            // Verifique se os parâmetros passados são válidos.
            validParams = validateParams(text, sourceId, trigger, delay);

            // Interrompe a execução se os parâmetros não são válidos.
            if (!validParams) {
                return;
            }

            // Se chegou até aqui é porque está tudo certo com os parâmetros
            // A partir daqui começam as transformações no DOM.

            // Obtém o elemento correspondente ao sourceId.
            source = $('#' + sourceId);
            
            // Guarda o atributo title e remove seu valor de element
            // Para evitar que o Bootstrap use esse atributo (fugindo do padrão do nosso widget)
            originalTitle = element.attr('title');
            element.attr('title', '');

            // Se trigger for um string, transforma em array para normalizar
            // a forma de tratá-lo daqui em diante.
            if ($.type(trigger) === 'string') {
                trigger = [trigger];
            }

            // Se 'manual' estiver informado em trigger, despreza tudo o mais
            if ($.inArray('manual', trigger) !== -1) {
                trigger = ['manual'];
            }
            
            // Guarda o atributo tabindex
            // Se esse atributo não estava definido previamente, e focus é um dos trigger,
            // define seu valor como'0';
            originalTabindex = element.attr('tabindex');
            if (originalTabindex === undefined && $.inArray('focus', trigger) !== -1) {
                element.attr('tabindex', 0);
            }
            

            element.attr({
                "role": "tooltip",
            });

            // Informou text
            if (text) {

                element.popover({
                    container: "body",
                    trigger:   "manual",
                    placement: "top",
                    html:      false,
                    content:   text
                });

            // Se não informou 'text', considerar o 'source'
            } else {
                source
                    .addClass("tooltip")
                    .attr("aria-hidden", "true");

                element.popover({
                    container: "body",
                    trigger:   "manual",
                    placement: "top",
                    html:      true,
                    content:   source.html()
                });
            }

            // Se vai disparar com hover
            if ($.inArray('hover', trigger) !== -1) {
                element.on('mouseenter'+eventNamespace, function () {
                    enter('hover');
                });
                element.on('mouseleave'+eventNamespace, function () {
                    leave('hover');
                });
            }

            // Se vai disparar com focus
            if ($.inArray('focus', trigger) !== -1) {
                element.on('focus'+eventNamespace, function () {
                    enter('focus', delay);
                });
                element.on('blur'+eventNamespace, function () {
                    leave('focus');
                });
            }

            // Fecha o Tooltip através da tecla ESC
            // Isso sempre vale para qualquer configuração
            element.on('keydown'+eventNamespace, function(e) {
                if (e.which === key.esc && shown) {
					e.stopPropagation();
                    hide();
                }
            });
            
            // Controla a variável que indica a visibilidade do tooltip.
            // - No evento 'hidden', false;
            // - No evento 'shown', true;
            element.on('hidden.bs.popover'+eventNamespace, function(e) {
                shown = false;
            });
            element.on('shown.bs.popover'+eventNamespace, function(e) {
                shown = true;
            });
        };

        init();

        // Revelando os métodos para a API pública do widget.
        $.extend(this, {
            destroy: destroy,
            show: show,
            hide: hide
        });
    };

    Tooltip.prototype = {

        name: 'Tooltip',

        defaults: {
            trigger: ['hover', 'focus'],
            delay: 0
        }
    };

    /*
     * Solicita o registro do widget
     */
    PIC.widgetRegister(Tooltip);

})(jQuery, window, document);

})();
/* Início de novo arquivo concatenado */
(function () {/* Zoomable */
/**
Este Widget adiciona a funcionalidade de zoom para as imagens.

Este widget possibilita duas marcações. Quando não é necessária uma descrição para a imagem (neste casa a propriedade alt do HTML necessária na tag img é suficiente) e quando é necessária uma descrição mais detalhada. As duas possibilidades possuem exemplos citados a seguir.

@module Zoomable
@attribute data-pic-zoomable
@param {text} [sourceId] - Informar o id do elemento que será a descrição da imagem.
@example
<!-- Imagem com uma breve descrição: -->
<img data-pic-zoomable src="images/imagemExemplo.png" alt="Breve descrição da imagem">

<!-- Imagem que exige descrição mais detalhada: -->
<div data-pic-zoomable='{"sourceId" : "descricao"}'>
    <img src="images/imagemExemplo.png" alt="Breve descrição da imagem">

    <div id="descricao">
        Este é um exemplo de descrição detalhada.
        Esta imagem representa o diagrama de Gestão da OS onde do ponto inicial seguimos para "Cadastrar SOlicitação de Proposta Técnica". Logo após seguimos para o ponto de "OS em Análise pela Fábrica". Em seguida podemos "Reformular a Proposta Técnica" ou seguir para "Executar Serviço". Em Seguida podemos acusar "Recebimento Provisório"
    </div>
</div>
*/
;(function ($, window, document, undefined) {

    'use strict';

    /*
     * Definição da classe
     */
    var Zoomable = function (widgetHelper) {

        /*
         * Variáveis de instância
         */
        var name = this.name,
            element = widgetHelper.element,
            options = widgetHelper.options,
            eventNamespace = widgetHelper.eventNamespace,
            cabecalhoHeight, /* Calcula a altura do cabeçalho */
            viewportHeight, /* Calcula a altura do Viewport */
            rodapeHeight, /* Calcula a altura do rodapé */
            zoomerHeight, /* Armazena o valor da altura após cálculo */
            zoomableParent; /* Armazena referência do elemento pai */
            
        /*
         * Métodos públicos
         */
        // Atualmente, não é possível fazer o destroy desse widget
        // pois a forma de implementação do zoomer não permite.
        this.destroy = $.noop;

        /*
         * Métodos privados
         */
        var createDefault = function () {
            
            var imgAlt,
                descricaoId,
                parentWidth;
            
            /* Armazena o alt */
            imgAlt = element.attr("alt");

            /* Cria um elemento container para aplicar o zoomer */
            element.wrap("<div></div>");

            /* Armazena a referência ao elemento pai */
            zoomableParent = element.parent();

            parentWidth = zoomableParent.actual("width");
            zoomableParent
                .css("width", "100%")
                .css("height", zoomerHeight).css("max-height", zoomerHeight);

            /* Instancia o zoomer */
            zoomableParent.zoomer();

            /* Cria elemento de descrição */
            zoomableParent.find("img").after("<div>"+ imgAlt +"</div>");
            zoomableParent.find("img").next().uniqueId();
            zoomableParent.find("img").next().css("display", "none");

            descricaoId = zoomableParent.find("img").next().attr("id");

            /* Cria elemento ARIA e insere tabindex */
            zoomableParent.find("img").attr("aria-labelledby", descricaoId);
            zoomableParent.find("img").attr("alt", imgAlt);
            zoomableParent.find("img").attr("tabindex", "0");
        };

        var createWithLongDescription = function () {
            
            var imgAlt,
                descricaoId,
                parentWidth,
                parentId,
                zoomableDescricao; /* Armazena a descrição para adicionar após o zoomer ser estanciado */
            
            /* Armazena descrição através do ID informado */
            zoomableDescricao = element.find("#"+options.sourceId);

            /* Armazena o valor do alt */
            imgAlt = element.find("img").attr("alt");

            /* Armazena a referência ao elemento pai */
            zoomableParent = element.parent();

            parentWidth = zoomableParent.actual("width");
            zoomableParent
                .css("width", "100%")
                .css("height", zoomerHeight).css("max-height", zoomerHeight);


            /* Define, dinamicamente, um id para o elemento pai e armazena este id */
            element.parent().uniqueId();
            parentId = element.parent().attr("id");

            /* Instancia o zoomer */
            zoomableParent.zoomer();

            /* Insere a descrição */
            $("div").find("#"+parentId).find("img").parent().append(zoomableDescricao);

            /* Armazena o id da descrição */
            descricaoId = options.sourceId;

            /* Reinsere o alt antes armazenado, insere tabindex e os elementos ARIA */
            $("div").find("#"+parentId).find("img").attr("alt", imgAlt);
            $("div").find("#"+parentId).find("img").attr("tabindex", "0");
            $("div").find("#"+parentId).find("img").attr("aria-describedby", descricaoId);
            $("div").find("#"+parentId).find("div#"+options.sourceId).css("display", "none");

            /* Para o funcionamento da acessibilidade o elemento precisa do click após o foco */
            $("div").find("#"+parentId).find("img").on('focus'+eventNamespace, function(){
                $(this).click();
            });
        };

        /*
         * Implementação do plugin (o que o plugin faz ou estende ao comportamento de outro)
         */
        
        
        /* Armazena a altura da viewport, rodapé, cabeçalho e efetua o cálculo
         * para aplicar no zoomer
         */
        viewportHeight = $(window).height();
        rodapeHeight = $(".rodape").actual("height");
        cabecalhoHeight = $("#cabecalho").actual("height");
        zoomerHeight = viewportHeight - rodapeHeight - cabecalhoHeight - 100;
            
        if (options.sourceId) {

            createWithLongDescription();

        } else {

            createDefault();
        }
        
        /* Método do zoomer para recalcular o tamanho da imagem de acordo com
         * o redimensionamento.
         */
        zoomableParent.on('resize'+eventNamespace, function () {
            zoomableParent.zoomer('resize');
        });
        
    };
    
    Zoomable.prototype = {
        
        name: 'Zoomable',
        
        defaults: {
            sourceId: ''
        }
    };

    /*
     * Solicita o registro do widget
     */
    PIC.widgetRegister(Zoomable);

})(jQuery, window, document);

})();
/* Início de novo arquivo concatenado */
(function () {/* Tabs */
/**
Apresenta o conteúdo em abas.

O `li` correspodente à aba mostrada inicialmente deve ser marcado com `data-pic-state-current`.
Se não for informado, a primeira aba será mostrada.

@module Tabs
@attribute data-pic-tabs
@example
<div data-pic-tabs>
   <ul class="tab-list">
       <!-- href deve coincidir com o id do conteúdo -->
       <li><a href="#t1">Aba 1</a></li>
       <li><a href="#t2">Aba 2</a></li>
   </ul>
   <div class="tab-content">
       <div id="t1">conteúdo 1</div>
       <div id="t2">conteúdo 2</div>
   </div>
</div>
*/
;(function ($, window, document, undefined) {

    'use strict';

    /*
     * Definição da classe
     */

    var Tabs = function (widgetHelper) {

        /*
         * Variáveis de instância
         * Defina todas aqui antes de usar
         */
        var name = this.name,
            element = widgetHelper.element,
            options = widgetHelper.options,
            eventNamespace = widgetHelper.eventNamespace,
            tabsArea = 0,
            increase = 0,
            tabsContainer,
            tabsContainerWidth = 0,
            scrolling,
            numBtns = 0,
            tabList,
            tabs,
            tabId,
            panels,
            triggers,
            initialActiveTab,
            hScrollInterval;

        /*
         * Métodos públicos
         */

        this.destroy = function () {

            widgetHelper.clearEvents();

            // Deixa de monitorar a posição da rolagem horizontal das abas
            clearInterval(hScrollInterval);

            // Remove css do controle deslizante das abas
            tabs.css({
                'margin-left': '',
                'width': ''
            });

            tabList.css({
                'width': '',
                'left': ''
            });

            // Remove a marcação dos elementos de conteúdos
            element.find('.tab-content').children()
                .removeAttr('role aria-labelledby aria-hidden')
                .removeClass('tab-pane fade');

            // Remove marcação do conteúdo ativo (corrente)
            element.find('.tab-content > .active').removeClass('active in');
            // Remove atributos dos links de cada aba (navegação)
            tabList.find('li a').removeAttr('role data-toggle aria-expanded aria-selected aria-controls tabindex id');
            // Devolve essa div à sua posição original
            element.find('.tab-content').appendTo(element);
            // Remove divs dos botões rigth e left
            tabsContainer.find('.controlBtnRight, .controlBtnLeft').remove();
            // Remove div.tabs-container
            tabs.unwrap();

            // Remove atributos e classes
            tabList
                .removeAttr('role')
                .removeClass('nav nav-tabs breakscroll');
            tabs
                .removeAttr('role')
                .removeClass('invisibar');

            // Remove indicação de aba ativa (corrente)
            tabList.find('.active').removeClass('active');
            // Remove div.tabs
            tabList.unwrap();
        };

        /*
         * Métodos privados
         */

        var tabsControl = function () {

            //Determina a largura da nav-tabs(ul) de acordo com o número e largura de cada aba;
            var widthNavTabs = 0,
                numTabPanelDiv = 0,
                anchorArray = [],
                idAbaActive,
                controlWidthBtns,
                navTabsPosition;

            numBtns = 0;

            element.find(".nav-tabs li").each(function () {

                var anchor,
                    selected;

                anchor = $(this).children().attr("href").replace("#","");
                anchorArray.push(anchor);

                if ($(this).hasClass("active")) {

                    selected = 'true';

                } else {

                    selected = 'false';
                }

                $(this).children().attr({
                    "role": "tab",
                    "data-toggle": "tab",
                    "aria-selected": selected,
                    "id": anchor + "-tab",
                    "aria-controls": anchor
                });

                numBtns++;
                widthNavTabs = widthNavTabs + $(this).actual("width") + 1;

                if ($(this).hasClass("active")) {
                    idAbaActive = $(this).children().attr("href");
                    $(idAbaActive).addClass("tab-pane fade active in");
                }
            });

            element.find(".tab-content").children().each(function(){

                $(this).attr("role", "tabpanel");

                $(this).attr("aria-labelledby", anchorArray[numTabPanelDiv] + "-tab");

                $(this).addClass("tab-pane fade");

                if ($(this).hasClass("active")) {
                    $(this).attr("aria-hidden", "false");
                } else {
                    $(this).attr("aria-hidden", "true");
                }
                numTabPanelDiv++;
            });

            //Determina um valor fixo para a largura dos botões de controle que deslizam as tabs para esquerda(<) e direita(>);
            controlWidthBtns = element.find(".controlBtnLeft").actual("outerWidth")*2;

            if (widthNavTabs < tabsContainer.actual("width")) {
                tabs.css("margin-left", "0");
                element.find(".controlBtnLeft").css("display", "none");
                element.find(".controlBtnRight").css("display", "none");

                element.find(".nav-tabs").css("width", "auto"); //Atribui largura a ul .nav-tabs;
                element.find(".nav-tabs").css("left", "0"); //Atribui posicao left a ul .nav-tabs;

                //Determina largura da div container do widget;
                tabsContainerWidth = tabsContainer.actual("width");

                //Determina largura da div tabs;
                tabs.css("width", "100%");

            } else {
                tabs.css("margin-left", element.find(".controlBtnLeft").actual("outerWidth"));
                element.find(".controlBtnLeft, .controlBtnRight").css("display", "block");

                element.find(".nav-tabs").css("width", widthNavTabs);//Atribui largura a ul .nav-tabs;

                //Determina largura da div container do widget;
                tabsContainerWidth = (tabsContainer.actual("width") - 1) - controlWidthBtns;

                //Determina largura da div tabs;
                tabs.css("width", tabsContainerWidth);
            }

            //É largura da .tabs-container subtraindo a largura das tabs somadas;
            //tabsArea = -Math.abs(tabsContainerWidth - widthNavTabs);
            tabsArea = -Math.abs(tabsContainerWidth - widthNavTabs) * -1;

            //Valor adicionado a margin para deslisar a tabs de maneira uniforme de acordo com a largura da tabs;
            increase = parseInt((tabsArea/numBtns).toFixed(1));

            navTabsPosition = parseInt(element.find('.nav-tabs').parent().css("left").replace("px",""));
            if(navTabsPosition < tabsArea-increase){
                element.find('.nav-tabs').css("left", tabsArea);
            }

        };

        var abaResponsiva = function () {

            element.find(".nav-tabs > li").each(function(){
                if($(this).attr("class") == "active"){
                    var position = $(this).position();
                    var abaPosition = parseInt(position.left.toFixed(1));
                    var abaWidth = parseInt($(this).actual("width").toFixed(1));
                    var abaNextWidth,
                        positionLeft;

                    if($(this).next().actual("width") !== null){
                        abaNextWidth = parseInt($(this).next().actual("width").toFixed(1));
                    }

                    abaNextWidth = parseInt($(this).next().actual("width"));

                    if($(this).next().actual("width") !== null){
                        positionLeft = parseInt((abaPosition - tabsContainerWidth) + abaWidth + abaNextWidth)/increase * increase;
                    }else{
                        positionLeft = parseInt((abaPosition - tabsContainerWidth) + abaWidth);
                    }

                    positionLeft = positionLeft.toFixed(0);

                    if(positionLeft > 0){
                        tabs.scrollLeft(positionLeft);
                    }
                }
            });
        };

        var prevNavTab = function () {

            var actualPosition = tabs.scrollLeft();

            if (actualPosition > 0 && actualPosition != increase) {
                tabs.scrollLeft(actualPosition - increase);
            } else {
                tabs.scrollLeft(0);
            }
            return false;
        };

        var nextNavTab = function () {

            var actualPosition = tabs.scrollLeft();

            if (actualPosition < tabsArea-increase) {
                tabs.scrollLeft(actualPosition + increase);
            } else {
                tabs.scrollLeft(tabsArea);
            }
            return false;
        };

        var showTabPanel = function (index) {
            // O método 'show' do bootstrap é disparado por meio da tab (trigger),
            // e não do panel em si.
            triggers.eq(index).tab('show');
            triggers.eq(index).focus();
        }

        // Ajusta atributos de triggers e panels quando um panel é exibido
        var setAttrOnShow = function (current, previous) {

            var currentIndex = triggers.index(current),
                previousIndex = triggers.index(previous);

            // Ajusta o tabindex dos triggers
            current.attr('tabindex', '0');
            previous.attr('tabindex', '-1');

            // Ajusta atributos ARIA dos triggers
            current.attr("aria-selected", "true");
            previous.attr("aria-selected", "false");

            // Ajusta atributos ARIA dos panels
            panels.eq(previousIndex).attr('aria-hidden', 'true');
            panels.eq(currentIndex).attr('aria-hidden', 'false');
        }


        // Controla o evento mouseup em window.
        var mouseupHandler = function () {

            // Executa apenas uma vez ('one', e não 'on')
            $(window).one('mouseup'+eventNamespace, function () {

                // Interrompe a ação repetida (prev/next)
                clearInterval (scrolling);

                return false;
            });
        };

        // Configura funcionamento dos botões (left/prev e right/next)
        var setupButton = function (button, action) {

            // No click no button, executa action
            button.on('click'+eventNamespace, action);

            // No mousedown do button, executa action repetidamente,
            // até que o mouse seja liberado (mouseup).
            button.on('mousedown'+eventNamespace, function () {

                scrolling = setInterval(action, 200);

                // Passa a monitorar o mouseup (no window)
                mouseupHandler();
                return false;
            });
        };

        var setTabScroll = function () {
            //Posição da aba com relação ao plano x na ul nav-tabs;
            var position = $(this).parent().position();
            var abaPosition = parseInt(position.left.toFixed(1)) + parseInt($(this).parent().width());
            var $tabs = $(this).parent().parent().parent();
            var $li = $(this).parent();

            //Valor da posicao da ul nav-tabs em relação ao container tabs a partir da esquerda;
            var leftPosition = $tabs.scrollLeft();

            //Calcula intersecção dos pontos com relação a direita;
            if (abaPosition > Math.abs(leftPosition) + tabsContainerWidth) {

                if ($(this).parent().index() + 1 != numBtns){
                    $tabs.scrollLeft(leftPosition + ($li.width()/increase).toFixed(0) * increase);
                } else {
                    $tabs.scrollLeft(tabsArea);
                }
            } else {
                if ($(this).attr("id") != tabId) {
                    $tabs.scrollLeft(leftPosition + ($li.width()/increase).toFixed(0) * increase);
                }

            }

            //Calcula intersecção dos pontos com relação a esquerda;
            if (abaPosition - parseInt($(this).parent().width()) <= Math.abs(parseInt($tabs.scrollLeft())) && abaPosition != increase) {
                if ($(this).parent().index() > 0) {
                    $tabs.scrollLeft(leftPosition - ($li.width()/increase).toFixed(0) * increase);
                } else {
                    $tabs.scrollLeft(0);
                }
            }
            tabId = $(this).attr("id");
        };

        var tabNavigation = function (e) {

            var keyCode = e.which,
                currentTabIndex = triggers.index(this);

            // right
            if (keyCode == key.right) {

                e.preventDefault();

                if (currentTabIndex < triggers.length - 1) {
                    showTabPanel(currentTabIndex + 1);
                }
            }
            // left
            else if (keyCode == key.left) {

                e.preventDefault();

                if (currentTabIndex > 0) {
                    showTabPanel(currentTabIndex - 1);
                }
            }
            // enter
            else if (keyCode == key.enter) {
                showTabPanel(currentTabIndex);
            }
            // end
            else if (keyCode == key.end) {

                e.preventDefault();

                if (currentTabIndex < triggers.length - 1) {
                    showTabPanel(triggers.length - 1);
                }
            }
            // home
            else if (keyCode == key.home) {

                e.preventDefault();

                if (currentTabIndex > 0) {
                    showTabPanel(0);
                }
            }
        };

        var setInitialActiveTab = function () {

            // Espera que um  único 'li' seja marcado como current
            initialActiveTab = tabList.find('li[data-pic-state-current]').index();

            // Se não encontrou, define a primeira delas como ativa por padrão.
            initialActiveTab = initialActiveTab === -1 ? 0 : initialActiveTab;

            tabList.find('li').eq(initialActiveTab).addClass('active');
        };

        /*
         * Implementação do plugin
         */

        tabList = element.find('.tab-list');
        tabs = tabList.wrap('<div class="tabs"></div>').parent();

        panels = element.find('.tab-content').children();

        setInitialActiveTab();

        tabs.addClass("invisibar");
        tabList.attr("role", "tablist");
        tabList.addClass("nav nav-tabs breakscroll");

        tabsContainer = tabs.wrap('<div class="tabs-container"></div>').parent();
        tabsContainer.prepend('<div class="controlBtnRight"><a title="Direita" class="btn-right"><span class="glyphicon glyphicon-menu-right"></span></a></div>');
        tabsContainer.prepend('<div class="controlBtnLeft"><a title="Esquerda" class="btn-left disable"><span class="glyphicon glyphicon-menu-left"></span></a></div>');

        element.find(".tab-content").appendTo(tabsContainer);

        tabsControl();

        triggers = tabList.find('[data-toggle=tab]');

        // Definindo tabindex inicial dos triggers
        triggers.attr('tabindex', '-1');
        triggers.eq(initialActiveTab).attr('tabindex', '0');

        tabsContainer.on('resize'+eventNamespace, function () {
            tabsControl();
            abaResponsiva();
        });

        //Listener ----------------------------/
        // Monitora a posição da rolagem horizontal das abas,
        // para habilitar/desabilitar os botões que fazem essa rolagem
        // @TODO: controlar melhor a execução desse 'setInterval', disparando-o somente se os botões existirem
        hScrollInterval = setInterval(function () {
            if (tabs.scrollLeft() > 0) {
                element.find(".btn-left").removeClass("disable");
            } else {
                element.find(".btn-left").addClass("disable");
            }

            if (tabs.scrollLeft() == tabsArea) {
                element.find(".btn-right").addClass("disable");
            } else {
                element.find(".btn-right").removeClass("disable");
            }
        }, 200);


        //Events ------------------------//
        setupButton(element.find('.btn-left'), prevNavTab);
        setupButton(element.find('.btn-right'), nextNavTab);

        // Controla quando o outline deve aparecer. Em suma: quando a navegação for por teclado, não por mouse ----------------------------/
        // Remove a classe "no-outline" de qualquer aba (quando uma delas receber o foco)
        triggers.on('focus' + eventNamespace, function () {
            tabList.find('.no-outline').removeClass('no-outline');
        });
        // Adiciona a classe "no-outline" da aba que for clicada
        triggers.on('click'+eventNamespace, function () {
            $(this).addClass('no-outline');
        });

        triggers.on('click' + eventNamespace, setTabScroll);
        triggers.on('keydown' + eventNamespace, tabNavigation);
        triggers.on('show.bs.tab' + eventNamespace, function (e) {
            setAttrOnShow($(e.target), $(e.relatedTarget));
        });
    };

    Tabs.prototype = {

        name: 'Tabs'
    };

    /*
     * Solicita o registro do widget
     */
    PIC.widgetRegister(Tabs);

})(jQuery, window, document);

})();
/* Início de novo arquivo concatenado */
(function () {/* Tree View */
/**
Transforma uma lista em uma estrutura de árvore. A marcação HTML deve ser sempre feita em lista `ul`.

@module Tree
@attribute data-pic-tree
@param {string} [source] - Indica a localização da fonte de dados, que deve entregar um json no formato descrito a seguir.
                           Pode ser a url de um arquivo estático, ou de um servidor que gere os dados dinamicamente.
@param {boolean} [open=false] - Indica que o primeiro nível da árvore deve iniciar aberto. Não tem efeito se `keepState=true`
@param {boolean} [keepState=false] - Indica que o estado da árvore deve ser mantido mesmo se a página for recarregada (usa armazenamento local do navegador).
                                     Para o bom funcionamento dessa opção, é importante que o atributo `id` do elemento em que o widget sera ativado esteja definido,
                                     pois o valor do `id` será usado como chave para manter o estado.
@param {JSON} [requestHeaders] - Cabeçalhos adicionais a serem passados na requisição remota de dados.
       Aceita um JSON contendo chaves e valores dos cabeçalhos. Ex.: {"Authorization": "token"}.
       Usado apenas quando `source` é informado



@complement Formato_dos_dados
Quando o widget obtém os dados remotamente, eles precisam ser entregues na forma de um array json.
Cada elemento do array corresponde a um nó da árvore. Um nó deve seguir o seguinte formato:

	{
		text: (o texto que será mostrado, associado ao nó - obrigatório),
		id: (identificador único do nó),
		children: (informação sobre os filhos desse nó - mais detalhes a seguir),
		href: (hyperlink que será seguido se o texto for clicado; se não for informado, o clique não provoca navegação)
	}

Note que a única chave obrigatória nesse objeto é `text`.

`children` pode ser informado de duas formas diferentes:

- array de nós, em que cada nó segue o mesmo formato descrito acima, podendo ter eles mesmos outros filhos:

      children: [
                  <no-filho-1>, <no-filho-2>, ...
                ]

- valor `true`, indicando que o nó possui filhos. Nesse caso, uma nova requisição será feita
  ao servidor para a obtenção dos filhos. O widget utiliza o `id` para indicar ao servidor
  qual nó está solicitando a informação de filhos. Veja o exemplo:

      {
          text: "Sessão de Acessibilidade e Experiência do Usuário",
          id: "seuso", // O valor "seuso" será utilizado na requisição, como em: http://endereco/recurso.php?node=seuso
          children: true
      }

Os dois tipos de `children` podem ser utilizados dentro de um único json que represente a árvore

Se `children` não for informado, ou for informado algum valor que possa ser considerado falso ou
vazio, o widget considera que o nó não possui filhos.


@example <caption>Dados locais (no próprio HTML), mantendo o estado da árvore</caption>
<!-- Note que o atributo id da ul está definido: isso é necessário para keepState funcionar bem -->
<ul data-pic-tree='{"keepState":true}' id='alvenaria'>
    <li>
        Elementos de alvenaria
        <ul>
            <li>
                Tijolo
                <ul>
                    <li>Tijolo cerâmico</li>
                    <li>Tijolo de vidro</li>
                    <li>Tijolo refratário</li>
                </ul>
            </li>
            <li>
                Elemento vazado
                <ul>
                    <li>Cogobo</li>
                </ul>
            </li>
            <li>
                Bloco
                <ul>
                    <li>Bloco de concreto</li>
                    <li>Bloco cerâmico</li>
                    <li>Bloco sílico-calcáreo</li>
                </ul>
            </li>
        </ul>
    </li>
</ul>

@example <caption>Obtendo dados remotos, forçando iniciar com o primeiro nível aberto</caption>
<ul data-pic-tree='{"source": "http://endereco/recurso.php", "open": true}'>
    <!-- Esse item não será considerado na construção da árvore; dados obtidos remotamente -->
    <li>Raiz</li>
</ul>


*/

;(function ($, window, document, undefined) {

    'use strict';

    /*
     * Definição da classe
     */
    var Tree = function (widgetHelper) {

        /*
         * Variáveis de instância
         */
        var name = this.name,
            element = widgetHelper.element,
            options = widgetHelper.options,
            eventNamespace = widgetHelper.eventNamespace,
            tree,
            plugins = ['types'],
            types = {},
            core = {};

        // Clona o elemento original, posiciona original e clone em uma estrutura
        // que preserve o original e onde o clone possa ser utilizado pelo jsTree
        var hideAndClone = function (original) {

            var clone = original.clone();

            // Cria a div mais externa, que vai conter tudo do widget
            // e deixa o elemento original oculto
            original
                .wrap('<div></div>')
                .css('display', 'none');
            // Insere o clone logo depois do original
            clone.insertAfter(original);
            // Cria div ao redor do clone, exigido pelo plugin jsTree
            clone.wrap('<div></div>');
            // Define um id para a div criada acima
            clone.parent().uniqueId();

            return clone;
        };

        // Pega a árvore representada em um JSON (treeData) e modifica cada um
        // dos nós para ficar no formato desejado antes de ser entregue ao
        // plugin jsTree. Percorre toda a árvore recursivamente.
        var normalize = function (treeData) {

            treeData = $.map(treeData, function (node, index) {

                var type;

                // children está definido, e não é false ou em branco
                if (node.children) {
                    // children é um array
                    if ($.isArray(node.children)) {
                        // children é um array com ao menos um elemento
                        if (node.children.length) {
                            // normaliza a subárvore representada por children
                            // (atenção para a recursividade)
                            node.children = normalize(node.children);
                        }
                        // children é um array vazio.
                        else {
                            type = 'file';
                        }
                    }
                }
                // children não definido, ou false ou em branco
                else {
                    type = 'file';
                }

                return {
                    id: node.id,
                    text: node.text,
                    type: type,
                    children: node.children,
                    a_attr : { href : node.href}
                };
            });

            return treeData;
        };

        // Garante que element tenha um id
        // Esse id será usado especialmente para guardar o estado da árvore, quando for o caso.
        // O ideal é que ele já tenha seu id definido pelo HTML
        element.uniqueId();
        // Protege a 'ul' original, cria um clone e prepara a estrutura necessária
        // para a instanciação do jsTree.
        // Aqui, tree é o elemento que será usado para instanciação do jsTree.
        tree = hideAndClone(element).parent();

        // Define os tipos de nó para o jsTree
        types = {
            "default": { // folder
                "icon": "jstree-icon jstree-folder"
            },
            "file": {
                "icon": "jstree-icon jstree-file"
            },
            'folder-open': {
                'icon': 'glyphicon glyphicon-folder-open'
            }
        };

        // Adiciona plugin 'state' à configuração, se for o caso
        if (options.keepState) {
            plugins.push('state');
        }

        // Dados locais (HTML)
        if (options.source === '') {

            // Define tipo 'file' para todos os nós que não contenham outros nós
            tree.find('li').not(':has(ul)').attr("data-jstree", '{"type":"file"}');

            // Mantém o estado da árvore no refresh da página
            if (options.keepState) {

                tree.jstree({
                    "plugins": plugins,
                    'types': types,
                    'state': { "key": element.attr('id') }
                });
            }
            else {

                // Se deve iniciar aberto, força a abertura
                if (options.open) {
                    // Insere as configurações nos nós de primeiro nível que contenham outros nós
                    tree.find('> ul > li').has('ul').attr("data-jstree", '{"type":"folder-open", "opened":true}');
                }

                tree.jstree({
                    "plugins": plugins,
                    'types': types
                });
            }
        }
        else { // Dados remotos

             //Verifica se o parâmetro requestHeaders é um Json válido
			 if (options.requestHeaders) {
                try {
                    // Faz o parse do conteúdo obtido
                    options.requestHeaders = JSON.parse(JSON.stringify(options.requestHeaders));
                }
                // Caso aconteça algum erro no parser:
                catch (exception) {
                    // Força string vazia
                    options.requestHeaders =  Tree.prototype.defaults.requestHeaders;
                    // Avisa sobre o erro ocorrido.
                    console.warn(name + ': O valor informado no parâmetro requestHeaders não é um JSON válido.\n',
                                'Será utilizado o valor default para esse parâmetro no elemento ', element);
                }
            } 

            core = {
                'data': {
                    'url': function (node) {
                        // A url da requisição AJAX será sempre o que foi informado em options.source
                        return options.source;
                    },
                    headers: options.requestHeaders,
                    'data': function (node) {
                        // A query que será submetida para o servidor na requisição AJAX
                        // será vazia para o nó raíz (#), ou o id do nó, como em:
                        // http://endereco/recurso.php?node=123
                        if (node.id === '#') {
                            return {};
                        }
                        else {
                            return { node: node.id };
                        }
                    },
                    'dataFilter': function (data) {
                        // Ao receber os dados, faz a normalização e então entrega para serem usados.
                        var json = normalize(JSON.parse(data));
                        return JSON.stringify(json);
                    }
                }
            };

            // Mantém o estado da árvore no refresh da página
            if (options.keepState) {

                tree.jstree({
                    "plugins": plugins,
                    'types': types,
                    'core': core,
                    "state": { "key": element.attr('id') }
                });
            }
            else {

                tree.jstree({
                    "plugins": plugins,
                    'types': types,
                    'core': core
                });

                // Se deve iniciar aberto, prepara para forçar a abertura
                if (options.open) {
                    // Quando a árvore estiver pronta
                    tree.on('ready.jstree' + eventNamespace, function () {
                        // Solicita a abertura de todos os nós de primeiro nível
                        tree.find('> ul > li').each(function (index, node) {

                            tree.jstree('open_node', node, $.noop, false);
                        });
                    });
                }
            }
        }

        /*
         * Configurando handlers que são comuns a todas as situações
         */

        // Define o tipo folder-open ao abrir
        tree.on('open_node.jstree' + eventNamespace, function (event, data) {
            data.instance.set_type(data.node, 'folder-open');
        });

        // Define o tipo default (folder) ao fechar
        tree.on('close_node.jstree' + eventNamespace, function (event, data) {
            data.instance.set_type(data.node, 'default');
        });

        // Direciona para o href definido, se houver.
        tree.on('click'+eventNamespace, '.jstree-anchor', function (e) {

            var href = $(this).attr('href');

            if (href !== '#') {
                window.location.href = href;
            }
        });

        /*
         * Métodos públicos
         */
        this.destroy = function () {

            // Remover listeners de eventos (padrão)
            widgetHelper.clearEvents();

            // Desfazendo tudo na div criada para o jsTree:
            // - remove listener de eventos
            // - destrói o plugin jsTree
            // - remove a div em si
            tree
                .off(eventNamespace)
                .jstree('destroy')
                .remove();

            // Remove a div mais externa, criada dinamicamente
            element.unwrap();
            // Torna o elemento original visível novamente
            element.css('display', '');

        };

    };

    Tree.prototype = {

        name: 'Tree',

        defaults: {
            source: '',
            open: false,
            keepState: false,
            requestHeaders: ''
        },

        domains: {
            open: [true, false],
            keepState: [true, false],
        }

    };

    /*
     * Solicita o registro do widget
     */
    PIC.widgetRegister(Tree);

})(jQuery, window, document);

})();
/* Início de novo arquivo concatenado */
(function () {/* Tree View */
/**
Transforma uma lista em uma estrutura de árvore.

@deprecated desde a versão 1.0 do PIC. Use [Tree]{@link module:Tree} em substituição.
@module Treeview
@attribute data-pic-treeview
@example
<ul class="navbar-collapse" data-pic-treeview>
    <li><a href="#">Funcionalidade de Primeiro Nível</a></li>
    <li><a href="#">Outra Funcionalidade como a Anterior</a></li>
    <li>
        <a href="#">Categoria Hipotética</a>
        <ul>
            <li><a href="#">Um item</a></li>
            <li><a href="#">Outro</a></li>
            <li><a href="#">E mais um da mesma categoria</a></li>
        </ul>
    </li>
    <li>
        <a href="#">Outra Categoria</a>
        <ul>
            <li><a href="#">Seja consistente</a></li>
            <li><a href="#">Agrupe adequadamente</a></li>
        </ul>
    </li>
    <li>
        <a href="#">Formas de Levantar as Categorias</a>
        <ul>
            <li><a href="#">Card Sorting</a></li>
            <li><a href="#">Focus Groups</a></li>
            <li><a href="#">Estudo do Negócio</a></li>
        </ul>
    </li>
</ul>
*/

;(function ($, window, document, undefined) {

    'use strict';

    /*
     * Variáveis globais
     */

    /*
     * Sobrescrevendo os valores default do plugin que está sendo estendido.
     * Esses valores que servem para todas as instâncias do plugin.
     */
    $.fn.navgoco.defaults.cookie.expires = 10;

    /*
     * Definição da classe
     */
    var Treeview = function (widgetHelper) {

        /*
         * Variáveis de instância
         */
        var name = this.name,
            element = widgetHelper.element,
            options = widgetHelper.options,
            eventNamespace = widgetHelper.eventNamespace,
            navgocoOptions;

        navgocoOptions = {
            save: true,
            cookie: {
                name: "navgoco",
                expires: false,
                path: '/'
            }
        };

        /*
         * Métodos públicos
         */
        this.destroy = function () {

            element.removeClass('pic-treeview');
            element.navgoco('destroy');
            element.removeUniqueId();
        };

        /*
         * Métodos privados
         */


        /*
         * Implementação do plugin (o que o plugin faz ou estende ao comportamento de outro)
         */

        element.uniqueId();
        element.navgoco(navgocoOptions);
        element.addClass('pic-treeview');

    };

    Treeview.prototype = {

        name: 'Treeview'

    };

    /*
     * Solicita o registro do widget
     */
    PIC.widgetRegister(Treeview);


})(jQuery, window, document);

})();
/* Início de novo arquivo concatenado */
(function () {/* Alert */
/**

Transforma um elemento de bloco, como um `div` ou um `p`, em uma mensagem de alerta
visualmente representada por uma caixa colorida, que pode ser fechada (é removida da página) pelo usuário.

@module Alert
@attribute data-pic-alert
@param {string} [type=info] - Tipos de mensagens de alert. Valores possíveis: success|info|warning|error.
@param {string} [priority=polite] - Para fins acessíveis. Se a mensagem deve ser comunicada imediatamente ou pode esperar a atenção do usuário. Valores possíveis: polite|assertive.
@example
<!-- Alert padrão -->
<p data-pic-alert>
    Verifique se você está com todos os documentos em mãos antes de iniciar o preenchimento.
</p>

<!-- Alert de falha -->
<p data-pic-alert='{"type": "error"}'>
    Não é possível enviar um documento ainda não assinado. Registre a assinatura antes de enviar.
</p>

*/

;(function ($, window, document, undefined) {

    'use strict';

    /*
     * Definição da classe
     */
    var Alert = function (widgetHelper) {

         /*
         * Variáveis de instância
         * Defina todas aqui antes de usar
         */
        var name = this.name,
            element = widgetHelper.element,
            options = widgetHelper.options,
            eventNamespace = widgetHelper.eventNamespace,
            typeClass = '',
            iconClass = '',
			alertTypeName = '',
			alertPriority = null;

        /*
         * Métodos públicos
         */

        this.destroy = function () {

            widgetHelper.clearEvents();

            element
                // Remove todas as possíveis classes que possas ter sido adicionadas a element
                .removeClass('alert alert-dismissible alert-success alert-info alert-warning alert-danger')
                .removeAttr('role');

            // remove os elementos criados dinamicamente (ícone e botão)
            element.children('span.glyphicon').first().remove();
            element.children('button.close').first().remove();
        };

        /*
         * Métodos privados
         */

        /*
         * Implementação do plugin (o que o plugin faz ou estende ao comportamento de outro)
         */
        element
            .addClass("alert alert-dismissible")
            .prepend("<span class=\"glyphicon\" aria-hidden=\"true\"></span>" +
                    "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Fechar\"><span aria-hidden=\"true\">&times;</span></button>");

        switch (options.type) {

            case "success":
				alertTypeName = "Sucesso";
                typeClass = "alert-success";
                iconClass = "glyphicon-ok";
				alertPriority = options.priority === "assertive" ? "alert" : null ;
                break;

            case "info":
				alertTypeName = "Informação";
                typeClass = "alert-info";
                iconClass = "glyphicon-info-sign";
				alertPriority = options.priority === "assertive" ? "alert" : null ;
                break;

            case "warning":
				alertTypeName = "Aviso";
                typeClass = "alert-warning";
                iconClass = "glyphicon-warning-sign";
				alertPriority = options.priority === "assertive" ? "alert" : null ;
                break;

            case "error":
				alertTypeName = "Erro";
                typeClass = "alert-danger";
                iconClass = "glyphicon-exclamation-sign";
				alertPriority= "alert";
                break;
        }

		element.attr("role",alertPriority);
		element.find(">span.glyphicon:first").attr("aria-label",alertTypeName);
        element.addClass(typeClass);
        element.children().first().addClass(iconClass);

    };

    Alert.prototype = {

        name: 'Alert',

        defaults: {
            type: "info",
			priority: "polite"
        },

        domains: {
            type: ["success", "info", "warning", "error" ],
			priority: ["polite", "assertive"]
        }
    };

    /*
     * Solicita o registro do plugin
     */
    PIC.widgetRegister(Alert);

})(jQuery, window, document);

})();
/* Início de novo arquivo concatenado */
(function () {/* Login */
/**
Transforma um bloco contendo um formulário em uma janela de login.

@module Login
@attribute data-pic-login
@param {string} [start=visible] - Define se janela de login inicia visível ou não visível. Valores possíveis: visible|hidden.
@param {string} [state=initial] - O estado da janela de login. Estados possíveis:
 - initial: Estado inicial. Não mostra nenhum alerta;
 - invalidPassword: Estado pré-definido. Usuário informou uma senha inválida;
 - authenticationFailed: Estado pré-definido. Ocorreu um erro genérico de autenticação. Não informa mais detalhes, o que seria um risco de segurança.
 - notAuthorized: Estado pré-definido. Usuário não está autorizado a acessar o sistema;
 - sessionExpired: Estado pré-definido. A sessão do usuário expirou;
 - custom: Estado customizado. Em uma situação que não se encaixe nos estados pré-definidos, use esse estado para personalizar a mensagem e o tipo de alerta;
@param {string} [alertType=info] - Define tipo do alerta. Utilizado apenas quando se state=custom. Valores possíveis: info|success|error|warning.
@param {string} [alertMsg] - Define mensagem do alerta. Utilizado (e obrigatório) apenas quando se state=custom.
@param {string} [alertCause] - Define mensagem complementar do alerta, com o objetivo de ajudar o usuário a identificar a causa do erro. Utilizado apenas quando se state=custom. Opcional.
@param {string} [alertSolution] - Define mensagem complementar do alerta, com o objetivo de guiar o usuário para a solução ou para buscar ajuda externa. Utilizado apenas quando se state=custom. Opcional.
@example
<div data-pic-login='{"state":"custom", "alertType":"info", "alertMsg":"Informe sua senha"}'>
	<form action="login.php" method="post">
        <div class="form-group">
            <label class="sr-only" for="username">Usuário</label>
            <input type="text" name="username" id="username" class="form-control" placeholder="Usuário" required="" autofocus="">
        </div>
        <div class="form-group">
            <label class="sr-only" for="password">Senha</label>
            <input type="password" name="password" id="password" class="form-control" placeholder="Senha" required="">
        </div>
		<input type="submit" id="btnSubmit" class="btn btn-default" value="Entrar">
	</form>
</div>							
*/
;(function ($, window, document, undefined) {

    'use strict';
    
    /*
     * Definição da classe
     */
    var Login = function (widgetHelper) {

        /*
         * Variáveis de instância
         * Defina todas aqui antes de usar
         */		 
        var name = this.name,
            options = widgetHelper.options,
            eventNamespace = widgetHelper.eventNamespace,
            element = widgetHelper.element,
            modalContent,
            modalClass,
            originalStyle,
            titleId,
            alertId,
            lastFocused,
            currentState,
            validStructure,
			self = this;
	
        /*
         * Métodos públicos
         */

        // Mostra o modal
        this.show = function(stateName, alertMsg, alertType, alertCause, alertSolution) {
            // Armazena o elemento que estava com foco exatamente antes de o modal ser aberto
            lastFocused = document.activeElement;
            element.modal('show');
            
            if (stateName !== undefined) {
                self.setState(stateName, alertMsg, alertType, alertCause, alertSolution);
            }
        };
		
        // Esconde (fecha) o modal
        this.hide = function () {
            element.modal('hide');
        };

        // Alterna a visibilidade do modal (mostra/esconde)
        this.toggle = function () {
            // Se não tem armazenado o elemento que estava com foco exatamente antes de o modal ser
            // aberto, armazena esse elemento (certamente, o modal está sendo aberto agora, não fechado)
            if (!lastFocused) {
                lastFocused = document.activeElement;
            }
			element.modal('toggle');
        };

		this.setState = function (stateName, alertMsg, alertType, alertCause, alertSolution) {
            
            // Se o estado informado não está na lista de possíveis estados
            if (!(stateName in self.STATE)) {
                // Avisa e aborta a execução de setState.
                console.warn ('Login: o estado informado não é um estado reconhecido. Foi informado: "'+ stateName +'". Assumindo o valor "initial".');
            	stateName = "initial";
            }

			currentState = self.STATE[stateName];
            
            // Estado initial
            if (stateName === 'initial') {
                // Remove o alerta
                removeAlert();
                // Ajusta o foco correspondente
                element.find(currentState.focus).focus();
            }
            // Estado custom
            else if (stateName === 'custom') {
                // Se a mensagem foi informada
                if (alertMsg !== undefined) {
                    // Usa o tipo informado ou, se não foi informato, o tipo padrão para custom.
                    alertType = alertType || self.defaults.alertType;
                    insertAlert(alertType, alertMsg, alertCause, alertSolution);
                    element.find(currentState.focus).focus();
                // Se a mensagem não foi informada
                } else {
                    console.warn("Login: para definir um estado customizado, é necessário informar a mensagem.");
                }
            }
            // Um dos estados predefinidos
            else {
                // Insere o alerta correspondente
                insertAlert(currentState.type, currentState.message, currentState.cause, currentState.solution);
                // Ajusta o foco correspondente
                element.find(currentState.focus).focus();
            }
		};		
		
        // Destrói instância do Modal
        // @TODO Revisar para ver se está funcionando bem.
        this.destroy = function () {

            var customButtonsWrapper,
                modalContent,
				helperAlert;
                
            // Não tem nada a desfazer se a estrutura não for a esperada.
            if (!validStructure) {
                return;
            }

            widgetHelper.clearEvents();

            // Localiza botões que tenham sido criados dinamicamente.
            customButtonsWrapper = element.find('.modal-footer.buttons');

            if (customButtonsWrapper.length) {
                // Remove classes e atributos dos botões
                customButtonsWrapper.children('button')
                    .removeClass('btn btn-default')
                    .removeAttr('data-dismiss');
                // Remove classe do wrapper e o remove do DOM
                customButtonsWrapper
                    .removeClass('modal-footer')
                    .detach();
            }

			//Remove container com mensagem usada no Alert
			element.find(".modal-body").children(":first").remove();
			
            // Armazena o conteúdo do corpo do modal
            modalContent = element.find('.modal-body').children().detach();
            // Remove toda a estrutura que foi criado dinamicamente para o modal
            element.find('.modal-dialog').remove();
            // Devolve para o DOM o conteúdo que havia se tornado o corpo do modal
            element.append(modalContent);

            element.removeAttr('role tabindex aria-hidden aria-modal data-keyboard aria-labelledby');
            element.removeClass('modal fade');

			//Remove as customizações de alerta
			helperAlert = element.find(".helper-alert");

			helperAlert.find(".helper-text").removeClass(".helper-text");
			helperAlert.find(".helper-causes").removeClass(".helper-causes");
			helperAlert.find(".helper-guidance").removeClass(".helper-guidance");
			helperAlert.removeClass(".helper-text");

			// Devolve o valor original de style
            element.attr('style', originalStyle);

            // Esconde backdrop;
            element.modal('hide');
			
			// Destroy Alert
			PIC.destroyWidget('Alert', element.find(".alert"), true);
        };
		 
        /*
         * Métodos privados
         */
         
         
        // Adiciona, se for o caso, o selo de ambiente na janela de login.
        var seloAmbiente = function () {
            
            var cloneSeloAmbiente = $(".seloAmbiente").clone();

            // Adiciona o selo no modal.
                element
					.find(".modal-body")
					.before(cloneSeloAmbiente);
                element
					.find(".seloAmbiente")
					.removeClass('seloAmbiente')
					.addClass('seloAmbienteLogin');
        };
        
        var removeAlert = function () {
            
            // Busca o alert que tenha sido inserido pela função insertAlert, por meio do id
            var alert = $('#'+alertId);
            
            // Se existe o alert definido pelo Login
            if (alert.length) {
                // Destrói o Alert
                PIC.destroyWidget('Alert', alert, true);
                alert.remove();
            }
        }
        
		var insertAlert = function(type, msg, cause, solution) {
            
            var alert,
                alertOptions = {
                    type: type
                };
            
            // Busca o alert que tenha sido inserido por essa função, por meio do id
            // Armazena-se o id (em vez de o elemento em si) porque o usuário pode
            // 'fechar' o alert, fazendo com que ele deixe de existir na página.
            alert = $('#'+alertId);
            
            // Se já existe o alert definido pelo Login
            if (alert.length) {
                // Destrói o Alert
                PIC.destroyWidget('Alert', alert, true);
            }
            // Se não existe o alert
            else {
                // Cria a div com id único, e armazena esse id.
                alert = $('<div></div>').uniqueId();
                alertId = alert.attr('id');
                // Insere a div criada no DOM
                element.find('.modal-body').prepend(alert);
            }
            // Insere/atualiza o texto da mensagem
			alert.addClass("helper-alert");
            alert.html(
				"<p class='helper-text'>" + msg + "</p>" + 
				(cause===undefined ? "" : "<p class='helper-causes'>"  + cause + "</p>") + 
				(solution===undefined ? "" : "<p class='helper-guidance'><b>Dica: </b>" + solution + "</p>")
			);
            // Ativa o Alert
            PIC.activateWidget('Alert', alert, alertOptions, true);
		};
		 
        // Executa assim que o modal é escondido (fechado).
        var onHidden = function () {
            // Se havia sido armazenado o último elemento com foco,
            // devolve o foco para ele, e deixa-o novamente indefinido.
            // Todo o tratamento feito com a variável lastFocused faz sentido apenas para modal
            // aberto programaticamente, ou seja, via chamada dos métodos show() e toggle().
            // Quando o desenvolvedor associa via atributos um botão a um modal, o próprio widget
            // do Bootstrap faz esse tratamento de foco.
            if (lastFocused) {
                $(lastFocused).focus();
                lastFocused = undefined;
            }
            // Alterna os valores do atributo aria-hidden quando a visibilidade da modal é alterada
            element.attr('aria-hidden', 'true');
        };

        var defineModalClass = function () {
            
            return ('modal-dialog modal-md');
        };

        // Verificador de marcação e intens obrigatórios
        var checkModalLogin = function () {
            
			var check = true,
                form = element.find('form');
            
			// Se não há nenhum form
            if (!form.length) {
				console.warn("Login: não pode ser criado sem um formulário (<form>).");
				check = false;
                // Se não há nem mesmo form, não faz as demais verificações (aborta a execução daqui).
                return check;
			}
            
            // Se não há nenhum input text
            // Procura um input type='text', ou input sem type especificado, conforme documentação
            // do seletor ':text' -- https://api.jquery.com/text-selector/
            if (!form.find("input:text").length) {
				console.warn("Login: não pode ser criado sem um campo de entrada tipo texto (<input type='text'>)");
				check = false;							
			}
            
            // Se não há nenhum input password
            if (!form.find("input:password").length) {
				console.warn("Login: não pode ser criado sem um campo de entrada tipo password (<input type='password'>)");
				check = false;
			}
            
            // Se não há nenhum botão que permita a submissão (input ou button, do tipo submit ou button)
            if (!form.find("input[type='submit'], input[type='button'], button[type='submit'], button[type='button']").length) {
				console.warn("Login: não pode ser criado sem um botão (<input type='submit'>)");
				check = false;
			}
			
            // Verifica todos os inputs do tipo texto e password
            form.find("input:text, input:password").each(function () {
                
                var inputId = $(this).attr('id');
                
                // Se o input tem id
                if (inputId) {
                    // ... mas não há label associado a esse id 
                    if (!form.find('label[for="' + inputId + '"]').length) {
                        console.warn(
                            'Login: não pode ser criado se o campo cujo id é "' + inputId + '" ' +
                            'não possuir label associado (por meio do atributo "for" do label).'
                        );
                        check = false;
                    }
                }
                // Se o input não tem id
                else {
                    console.warn(
                        'Login: não pode ser criado se houver campo tipo texto ou password ' +
                        'sem atributo "id" definido.'
                    );
                    check = false;
                }
			});
			
			return check;
        };

        /*
         * Implementação do plugin (o que o plugin faz ou estende ao comportamento de outro)
         */
		
        validStructure = checkModalLogin();
        
        // Interrompe a execução se a estrutura não for a esperada
        if (!validStructure) {
            return;
        }
        
        // Armazena o conteúdo original do atributo style (ou um string vazio se não estiver definido)
        originalStyle = element.attr('style') || '';

        // Classes
        element.addClass("modal fade");

        // Atributos
        element.attr({
            "role":             "dialog",
            "tabindex":         "-1",
            "aria-hidden":      "true",
            "aria-modal":       "true",
        });
	
        // Armazena aqui tudo o que está contido no element, e remove do DOM
        modalContent = element.children().detach();

        // Define que classe(s) a modal deve possuir, conforme o diálogo e o tipo.
        modalClass = defineModalClass(options.type, options.size);

        element.append('<div class="' + modalClass + '" ></div>');

        // Cria área de conteúdo (cabeçalho, corpo, rodapé)
        element.find('.modal-dialog').append('<div class="modal-content"></div>');
        // Cria área para cabeçalho
        element.find('.modal-content').append('<div class="modal-header"></div>');
		
		// Insere título, fazendo com que ele seja o rótulo do modal (via aria-labelledby)
        element.find('.modal-header').append('<h4 class="modal-title">Login do sistema</h4>');
        titleId = element.find('.modal-title').uniqueId().attr('id');
        element.attr('aria-labelledby', titleId);

        // Cria área do corpo
        element.find('.modal-content').append('<div class="modal-body"></div>');
        // Reinsere o conteúdo original no corpo
        element.find('.modal-body').append(modalContent);
        seloAmbiente();
        
        // Inicializa a modal, sem exibir na inicialização.
        element.modal({
            keyboard: false,
            backdrop: 'static',
            show: false
        });

		// Para execução automática da modal de login (start=visible)
		if (options.start === "visible") {
            // "Agenda" a exibição quando o documento estiver pronto
            $(document).ready( function() {
                // Exibe a modal com as opções informadas.
                self.show(options.state, options.alertMsg, options.alertType, options.alertCause, options.alertSolution);
            });
		}
        
		
        /*
		* Eventos
        */
		element.on('hidden.bs.modal' + eventNamespace, onHidden);

        // Configura altura do corpo de conteúdo da modal de acordo com a resolução de tela do usuário
        element.on('show.bs.modal' + eventNamespace, function(){
            element.find('.modal-body').css('overflow-y', 'auto');
            // element.find('.modal-body').css('max-height', $(window).height()/100 * 70);
        });

        // O foco ira para o elemento definido pelo estado
        element.on('shown.bs.modal' + eventNamespace, function(){
            // Se o estado atual define um elemento para receber o foco
            element.find(currentState.focus).focus();
            // Alterna os valores do atributo aria-hidden quando a visibilidade da modal é alterada
            element.attr('aria-hidden', 'false');
        });
    };

    Login.prototype = {

        name: 'Login',

        defaults: {
			state: "initial",
            alertType: "info",
			start: "visible"
        },

        domains: {
            state: ['initial', 'custom', 'invalidPassword', 'sessionExpired', 'notAuthorized', 'authenticationFailed'],
            alertType: ["info", 'warning', 'error', 'success'],
			start: ["visible", "hidden"]
        },
        
        STATE: {
            initial: {
                focus:   'input:text:first'
            },
            notAuthorized: {
                message: 'O sistema não encontrou sua autorização de acesso',
				cause:   'Pode ser que seu processo de autorização não tenha finalizado ou que sua autorização tenha expirado.',
				solution:'Consulte o gestor de negócios ou o CENIN para mais detalhes.',
                type:    'warning',
                focus:   'input:text:first'
            },
            invalidPassword: {
                message: 'O sistema esperava outra senha',
				cause:   'Pode ser que seu teclado esteja com a entrada de MAIÚSCULAS ativada.',
				solution:'Verifique sua entrada e tente novamente. Se esqueceu a senha, entre em contato com o CENIN para mais detalhes.',
                type:    'warning',
                focus:   'input:password:first'
            },
            authenticationFailed: {
                message: 'O sistema encontrou um problema de autenticação',
				cause:   'Pode ser que você tenha fornecido um outro código de usuário, uma senha diferente ou até que a senha tenha expirado.',
				solution:'Se você acha que está tudo certo com a senha, tente novamente. Se não, entre em contato com o CENIN para mais detalhes.',
                type:    'warning',
                focus:   'input:text:first'
            },
            sessionExpired: {
                message: 'O sistema encerrou a sessão',
				cause:   'O sistema encerra por falta de atividade em um período pré-determinado de tempo.',
				solution:'Informe novamente usuário e senha para revalidar a sessão.',
                type:    'warning',
                focus:   'input:password:first'
            },
            custom: {
                focus:   'input:text:first'
            }
        }
    };
    
    /*
     * Solicita o registro do widget
     */
    PIC.widgetRegister(Login);

})(jQuery, window, document);

})();
/* Início de novo arquivo concatenado */
(function () {/* Chart */
/**
Cria gráficos a partir de dados de uma tabela.
@complement Configuração_interna
- `data`: Somente para gráficos baseados em tabelas. Determina que cabeçalho(s) (`th`) correponde(m)
  aos dados que devem ser apresentados no gráfico.
  É necessário informar ao menos cabeçalho.
- 'label': Somente quando `type=meter` - obrigatório. Determina o título do gráfico.
- 'value': Somente quando `type=meter` - obrigatório. Determina o valor a ser apontado no gráfico e ajuda a compor o sumário textual do gráfico. Use valores numéricos percentuais - desde que não utilize `maxValue` - ou racionais - neste caso haverá um cálculo percentual com `maxValue`.
- 'unit': quando `type=meter` - obrigatório. Ajuda a compor o sumário textual do gráfico com o tipo de objeto que foi medido.
- 'maxValue': Somente quando `type=meter` - opcional. Determina o valor máximo a ser atingido pelo objeto medido e ajuda a compor o sumário textual do gráfico. Não use valores percentuais.
@module Chart
@attribute data-pic-chart
@param {string} type - Tipo de gráfico. Valores possíveis: bar|pie|meter.
@param {string} [transfomBreakpoint=xs] - Determina a partir de qual largura de tela a tabela será
       transformada em gráfico. Valores possíveis: xs|sm|md|lg.
@param {array} [rangesMarks=[20,80]] - Determina em que pontos da escala haverá mudança de faixa.
       Deve ser informado como um array de duas posições, representando um percentual,
	   com valores entre 1 e 100, sendo o segundo valor maior do que o primeiro.
	   O fundo de escala do gráfico possui três cores: a primeira vai de zero até o primeiro
	   valor informado; a segunda, desse ponto até o segundo valor informado; a terceira, desse
	   ponto até o final. Utilizado apenas quando `type=meter`.

@example
<table data-pic-chart='{"type": "pie"}' class="table">
    <caption class="sr-only">Valores</caption>
    <thead>
        <tr>
            <th>Mês</th>
            <!-- Indicação de que esse cabeçalho (coluna) será 'plotado' no gráfico -->
            <th data-pic-chart-config='data'>Valor</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th>Janeiro</th>
            <td>1000</td>
        </tr>
        <tr>
            <th>Fevereiro</th>
            <td>1500</td>
        </tr>
        <tr>
            <th>Março</th>
            <td>3000</td>
        </tr>
    </tbody>
</table>
@example
<div data-pic-chart='{"type": "meter"}'>
	<span data-pic-chart-config="label">Adequação ao Processo</span>:
	<span data-pic-chart-config="value">3</span> de 
	<span data-pic-chart-config="maxValue">7</span>
	<span data-pic-chart-config="unit">respostas positivas</span>
</div>
*/
;(function ($, window, document, undefined) {
    'use strict';
    /*
     * Variáveis globais
     * no escopo da closure
     */
    /*
     * Tudo o que for necessário executar apenas uma vez, na carga da página
     * deve estar escrito aqui.
     * Se, por exemplo, o plugin que está sendo extendido expõe seus valores default
     * e é necessário modificar algum desses valores de forma geral,
     * isso deve ser feito aqui.
     */
	// $.fn.pluginOriginal.defaults.opcao = 'novo-valor';
	/*
	* Definição da classe
	*/
    var Chart = function (widgetHelper) {
         /*
         * Variáveis de instância
         * Defina todas aqui antes de usar
         */
        var name = this.name,
            element = widgetHelper.element,
            options = widgetHelper.options,
            eventNamespace = widgetHelper.eventNamespace,
            chart,
            chartContainerWidth,
            chartContainerHeight,
            hiddenSource,
            showCanvas;
		var caption = element.find("caption").text(),
            canvas,
            canvasId,
            arrTitles = [],
            arrSubTitles = [],
            arrTooltipsTitles = [],
            arrData = [],
            arrTemp = [],
            arrTooltipColuns = [],
            arrColorPattern = [ '#0d3c55', '#c02e1d', '#f16c20',
                                '#ecaa38', '#a2b86c', '#ef8b2c',
                                '#d94e1f', '#0f5b78', '#117899',
                                '#1395ba', '#ebc844', '#5ca793'];
		
		/*
		* Varáveis acrescidas pela impmentação do gráfico Meter
		*/
		
		var validateRanges = function() {
				if ( options.rangesMarks.constructor !== Array || 
					options.rangesMarks.length !== 2 ||
					options.rangesMarks[0] > 100 ||
					options.rangesMarks[1] < 1 ||
					options.rangesMarks[0] >= options.rangesMarks[1] ) {
					return false;
				} else {
					return true;
				}			
		};
		
		var meterValue,
			meterLabel,
			meterRadius,
			meterSummaryTextSize,
			meterSummaryTextRate = 1.6,
			segmentRadius,
			needleRadius,
			textSize,
			titlePositionY,
			temp,
			firstRangeTop = validateRanges() ? options.rangesMarks[0] : Chart.prototype.defaults.rangesMarks[0],
			secondRangeTop = validateRanges() ? options.rangesMarks[1] : Chart.prototype.defaults.rangesMarks[1];
        /*
         * Métodos públicos
         */
        this.destroy = function () {
            widgetHelper.clearEvents();
            
            // O RGraph não possui um método "destroy" para ser chamado diretamente.
            // Aqui, era o que deveríamos fazer: solicitar ao RGraph que desfizesse tudo o que
            // foi feito. 
            // Pelo estudo da documentação, foi decidido fazer o seguinte:
            // - solicitar a limpeza dos listeners
            // - solicitar a limpeza do canvas (afeta elementos visuais e tooltip)
            // - solicitar a remoção do canvas do registro de objetos
            // Talvez outras coisas devessem ser feitas.
            // @TODO Estudar a documentação e aprimorar esse procedimento para evitar possíveis leaks de memória
            // @TODO Ver também: http://www.rgraph.net/forum/message.html/how-to-delete-from-memory-a-graph-object-20131128180050.html
            RGraph.clearEventListeners(canvasId);
            RGraph.clear(document.getElementById(canvasId));
            RGraph.ObjectRegistry.clear(canvasId);
            // Remover atributos das células
            element.find('td').removeAttr('data-title');
            // Remover canvas
            chart.find('canvas').remove();
            // Remover div.no-more-tables
            element.unwrap();
            // Remover div.chart
            element.unwrap();
            element.removeUniqueId();
        };
        /*
         * Métodos privados
         */
         /*
         * Função para manipulação de largura e altura do gráfico gerado
         */
		var chartResize = function(canvas, chart){
		 
		var width = element.actual('width');
            // Define a largura do gráfico como a largura total disponível
            // e a altura como 50% da largura total disponível.
			canvas.width = width;
			if(chart.type==="meter") {
				setMeterDimensions(width);
				chart	.set('text.size', textSize)
						.set('title.vpos',0.5)
						.set('needle.radius', needleRadius)
						.set('radius', meterRadius)
						.set('segment.radius.start', segmentRadius)
						.set('gutter.top', chartContainerHeight * 0.12)
						.set('gutter.bottom', chartContainerHeight * 0.05);
				canvas.height = chartContainerHeight;
				element.closest(".chart").find(".meter-summary span").css("font-size",meterSummaryTextSize+"px");
			} else {
				canvas.height = width / 2;
			}
             canvas.__rgraph_aa_translated__ = false;
             chart.draw();
         };
		 
         var createChartContainers = function () {
            /* Define classes bootstrap a serem usadas de acordo com ponto de partida informado
            * para apresentação do gráfico e inibição da apresentação do elemento original
            */
            switch(options.transformBreakpoint) {
                case "xs":
                    hiddenSource = "hidden-xs hidden-sm hidden-md hidden-lg";
                    showCanvas = "visible-xs visible-sm visible-md visible-lg";
                    break;
                case "sm":
                    hiddenSource = "visible-xs hidden-sm hidden-md hidden-lg";
                    showCanvas = "hidden-xs visible-sm visible-md visible-lg";
                    break;
                case "md":
                    hiddenSource = "visible-xs visible-sm hidden-md hidden-lg";
                    showCanvas = "hidden-xs hidden-sm visible-md visible-lg";
                    break;
                case "lg":
                    hiddenSource = "visible-xs visible-sm visible-md hidden-lg";
                    showCanvas = "hidden-xs hidden-sm hidden-md visible-lg";
                    break;
            }
            /*
            * Caso o browser utilizado pelo usuário seja IE8 retira o canvas
            * e apresenta o conteúdo original no qual o gráfico é baseado.
            */
            if($.browser.msie){
                if($.browser.versionNumber === 8){
                    hiddenSource = "visible-xs visible-sm visible-md visible-lg";
                    showCanvas = "hidden-xs hidden-sm hidden-md hidden-lg";
                }
            }
            /*
            * Crio container chart e altero  para que ele possa ser container
            * do elemento original e do canvas e atribuo id ao original
            */
            element
                .uniqueId()
                .wrap("<div class=\"chart\">");
            chart = element.parent();
            /*
            * Capturo a largura e altura do container onde está o chart
            * para estabeler seu tamanho inicial
            */
            chartContainerWidth = function() {
				var chartWidth = element.actual("width");
				/*
				* Retorna o máximo de 384 somente se o gráfico for "meter" para larguras
				* maiores que de celular
				*/
                if (options.type === "meter" && !PIC.isXS($(window).actual("width"))) {
					chartWidth = (chartWidth > 384) ? 384 : chartWidth;
				}
				return chartWidth;
			}();
            chartContainerHeight = function() {
				var chartHeight;
				/*
				* A relação de altura e largura varia dependendo do tiupo do gráfico
				*/
				if (options.type === "meter" ) {
					chartHeight = chartContainerWidth / 1.8 ;
				} else {
					chartHeight = chartContainerWidth / 100 * 50 ;
				}
				return chartHeight; 
			}();
            /*
            * Crio container para a tabela para inserir classe "no-more-tables" e classes do bootstrap para
            * exibir e esconder a tabela/gráfico de acordo com os parametros
            * informados pelo usuário sm, dm ou lg
            */
			if (options.type !== "meter" ) {
				element.wrap("<div class=\"no-more-tables " + hiddenSource + "\">");
			}
            chart.append("<canvas class=\""+ showCanvas +"\" width="+ chartContainerWidth +" height="+ chartContainerHeight  +">Este browser não possui suporte para a geração do gráfico.</canvas>");
            /*
            * Crio id ao canvas e atribuo valor a variável para manipulação do canvas pelo RGraph
            */
            chart.find("canvas").uniqueId();
            canvasId = chart.find("canvas").attr("id");
        };
        
		/*
        * Cria e alimenta atributo data-title para cada td da tabela
        */
        var createDataTitle = function () {
            element.find('th').each(function (i) {
                var th = $(this).text();
                element.find('tr').each(function (n) {
                    var $row = $(this);
                    $('td:eq("'+i+'")', $row).attr("data-title", th);
                });
            });
        };
		
        var getTableBasedChartData = function () {
            var tableRow = 0,
                headerRowCell,
				headerColumnCellText,
				headerRowCellIndex,
				headerColumnCellIndex,
				cellData;
            /*
			* Cria arrays com células marcadas com o atributo data-pic-chart-config=data
			*/
            var chartData = element.find("*").filterByConfig(name, "data");
			
			// Caso não tenha sido indicado ao menos um eixo é apresentada mensagem de warning sobre essa necessidade
            if (chartData.length === 0) {
                console.warn ('Chart: indique ao menos um cabeçalho de sua tabela (th) como fonte de dados, usando a configuração "data".', element);
            }
			
			// Alimenta arrays com dados obtidos a partir da tabela tipo chart
            chartData.each(function () {
				// Busca índice da célula tipo cabeçalho
				headerColumnCellIndex = $(this).index();
				
                // Se os eixos do gráfico forem definidos a partir do cabeçalho da tabela
				// Se item marcado como data tiver como antecessor <thead>
                if ($(this).closest("thead").length === 1) {
					// Busca nome do título/rótulo da célula tipo cabeçalho marcada como data
					headerColumnCellText = $(this).text();
					
					// Alimenta arrays com títulos e subtítulos de acordo com o tipo do gráfico
					switch(options.type) {
						case "bar":
							arrSubTitles.push(headerColumnCellText);
						break;
						case "line":
							arrTitles.push(headerColumnCellText);
						break;	
						case "pie":
							arrTitles.push(headerColumnCellText);
						break;						
					}				
					
					// Busca dados para alimentar gráfico no corpo da tabela
					element.find("tbody>tr").each(function(i) {
						// Busca dados das celulas de acordo com os títulos marcados no thead
                        $(this).find(":eq("+headerColumnCellIndex+")").each(function(){
							cellData = parseInt($(this).text());
						});

						// Busca título/rótulo da linha, por padrão é definido na primeira célula;
						headerRowCell = $(this).children().first().text();
												
                        // Alimenta array com dados para tooltip do gráfico quando tipo de gráfico selecionado for pizza
                        if (options.type === "pie") {arrTooltipsTitles.push(headerRowCell);}
						
						// Cria array com dados encontrados de acordo com o tipo de gráfico
						switch(options.type) {
							case "bar":
								arrTemp.push(cellData);
								if(tableRow === 0){arrTitles.push(headerRowCell);}
							break;
						case "line":
								arrTemp.push(cellData);
								if(tableRow === 0){arrSubTitles.push(headerRowCell);}								
							break;
						default:
							arrData.push(cellData); 
						}
                    });
					// Define valor de acordo com a sequencia do loop para linha percorrida
                    tableRow++;	
					if(options.type != "pie"){arrData.push(arrTemp);}
					arrTemp = [];					
                }

                 // Se os eixos do gráfico forem definidos a partir dos cabeçalhos contidos no corpo da tabela(tbody)				
				if ($(this).closest("tbody").length === 1) {
					// Busca nome do título/rótulo da célula tipo cabeçalho marcada como data
					//headerColumnCellText = $(this).text();				
				
					$(this).closest("tr").find("*").each(function(i){
						// Busca índice da célula
						headerRowCellIndex = $(this).index();
						
						// Busca dados das celulas
						cellData = parseInt($(this).text());
						
						// Se célula conter dado númerico
						if($.isNumeric(cellData)){					
							if (tableRow === 0){
								/*
								* Busca títulos das colunas na primeira sequancia do loop de acordo com o tipo de gráfico
								* e alimenta respectivos arrays
								*/
								headerColumnCellText = element.find("thead th:eq("+ headerRowCellIndex +")").text();

								switch(options.type) {
									case "bar":
										arrTitles.push(headerColumnCellText);	
									break;
									case "line":
										arrSubTitles.push(headerColumnCellText);
									break;										
									case "pie":
										arrSubTitles.push(headerColumnCellText);
										arrTooltipsTitles.push(headerColumnCellText);										
									break;											
								}
							}
							
							if(options.type === "pie") {
								arrData.push(cellData);
							}else{
								arrTemp.push(cellData);
							}
						}else{
							// Busca título correspondente a linha da célula 
							headerRowCell = $(this).closest("tr").children().first().text();
							
							switch(options.type) {
								case "bar":
									arrSubTitles.push(headerRowCell);	
								break;
								case "line":
									arrTitles.push(headerRowCell);
								break;
								case "pie":
									arrTitles.push(headerRowCell);
								break;
							}
						}
                    });
					tableRow++;
					if(options.type != "pie"){arrData.push(arrTemp);}
					arrTemp = [];				   
                }
            });
            
			// Alimenta array com dados para o tooltip do gráfico quando tipo for barras
            chartData.each(function () {
				var i, m;
                if (options.type === "bar" || options.type === "line") {
                    for ( i = 0; i < arrData.length; i++ ) {                        
						for ( m = 0; m < arrData[i].length; m++ ) {
							arrTooltipsTitles.push(arrData[i][m].toString());
						}
                    }
                }
            });
        };
		
		// Checa se a tabela está de acordo com o padrão
		var checkTable = function(table){
			var cellAmtHeader,
			numberCells, theadIntegrity = true,
			cellsFirstLine = [], cellsNextLine = [],
			numberLine, numberLineBody, typeError;
			
			// Verifica se existe <thead>
			if(table.find("thead").length === 0){
				typeError = "noHeader";
			}
			
			// Verifica se existe <tbody>
			if(table.find("tbody").length === 0){
				typeError = "noBody";
			}			
			
			// Verifica se existe 1 linha <tr> no cabeçalho da tabela
			if(table.find("thead>tr").length != 1){
				typeError = "noLineHead";
			}
			
			// Verifica se existe ao menos uma linha <tr> no corpo da tabela
			if(table.find("tbody>tr").length === 0){
				typeError = "noLineBody";
			}
			
			// Verifica se no cabeçalho da tabela existe ao menos 2 células
			if(table.find("thead>tr>*").length < 2){
				typeError = "minNumberCellsHeader";
			}
			
			// Busca número de células contidas no cabeçalho
			cellAmtHeader = table.find("thead>tr>*").length;
			
			/* Verifica números de célula por linha no corpo da tabela e se o número de células de cada linha
			* é igual ao número de células do cabeçalho
			*/
			table.find("tbody>tr").each(function(i){
				var numCells = $(this).children().length;

				numberLineBody = i+1;			
				if(numCells != cellAmtHeader){
					typeError = "cellsLine";
				}
				
				if(numCells < 2 ){
					typeError = "minNumberCellsBody";
				}				
			});

			// Verifica se no cabeçalho da tabela as células são <th>
			table.find("thead>tr>*").each(function(i){
				if(!$(this).is("th")){
					typeError = "structureHeader";
					return false;
				}
			});
			
			// Verifica se arrays informados são iguais entre si			
			table.find("tbody>tr").each(function(i){
				if(i === 0){
					$(this).find("*").each(function(i){				
						cellsFirstLine.push($(this).prop("tagName"));
					});
				}else{
					$(this).find("*").each(function(i){				
						cellsNextLine.push($(this).prop("tagName"));
					});
					
					var cellsTableBodyEqual = arraysEqual(cellsFirstLine, cellsNextLine, i+1);
					if(cellsTableBodyEqual === false){
						typeError = "structureLinesBody";
					}
					cellsNextLine = [];
				}
			});
			
			function arraysEqual(arr1, arr2, numberLine) {
				if(arr1.length !== arr2.length)
					return false;
					
				/* for(var i = arr1.length; i--;) {
					if(arr1[i] !== arr2[i] && i > 0)
						return false;
				}*/
				return true;
			}			
			
			// De acordo com o tipo de erro informa warning
			switch(typeError) {
				case "noHeader":
					console.warn("Tabela não possui cabeçalho <thead></thead>");
				break;				
				case "noBody":
					console.warn("Tabela não possui corpo <tbody></tbody>");
				break;				
				case "noLineHead":
					console.warn("O cabeçalho da tabela deve possuir no mínimo uma linha <tr></tr>");
				break;				
				case "noLineBody":
					console.warn("O corpo da tabela deve possuir no mínimo uma linha <tr></tr>");
				break;				
				case "cellsLine":
					console.warn("O Número de células da linha de nº "+numberLineBody+"  no corpo da tabela deve ser igual ao número de células do cabeçalho");
				break;				
				case "structureHeader":
					console.warn("A estrutura do cabeçalho deve ser composta de <th></th>");
				break;				
				case "structureLinesBody":
					console.warn("A estrutura das células no corpo da tabela devem ser iguais em número e marcação");
				break;				
				case "minNumberCellsHeader":
					console.warn("A estrutura do cabeçalho deve conter no mínimo duas células");
				break;				
				case "minNumberCellsBody":
					console.warn("A linha nº "+numberLineBody+ " possui menos de duas células");
				break;
				default:
					getTableBasedChartData();					
			}
		};
		
		var setMeterDimensions = function(newWidth) {
			/*
			* Atribuições de propriedades dos raios do arco e do ponteiro
			*/
			chartContainerWidth = newWidth;
			chartContainerHeight = newWidth / 1.8;
			meterRadius   = chartContainerHeight * 0.775;
			segmentRadius = meterRadius * 0.9;
			needleRadius  = segmentRadius * 0.83;
			/*
			* Definições de propriedades dos textos empregados na exibição
			*/
			textSize		= (chartContainerHeight - meterRadius) * 0.3;
			titlePositionY = (chartContainerHeight - meterRadius) * 0.5;
			
			meterSummaryTextSize = (textSize * meterSummaryTextRate);
			
		};
		
		var getMeterChartData = function () {
			/*
			* Busca pelos elementos de configuração dos valores do gráfico
			*/
			var meterSource = element.addClass("meter-source"),
				maxNumber = meterSource.find("[data-pic-chart-config]")
							.filterByConfig(name,"maxValue").text() || 100,
				meterUnit = meterSource.find("[data-pic-chart-config]").filterByConfig(name,"unit").text(),
				actualValue = meterSource.find("[data-pic-chart-config]").filterByConfig(name,"value").text(),
				isValuePercentage = false;
			meterLabel = meterSource.find("[data-pic-chart-config]").filterByConfig(name,"label").text();
			meterValue = function () {
					var relativeValue;
					var isNumberRE = /^\d*[0-9]([\.|\,]\d*[0-9])?$/;
					if (actualValue.match(isNumberRE)) {
						relativeValue = actualValue / maxNumber * 100;
					}
					if (actualValue.substr(-1, 1) === "%") {
						isValuePercentage = true;
						if(actualValue.replace("%", "").match(isNumberRE)) {
							relativeValue = actualValue.replace("%", "");
						} else {
							return undefined;
						}
					}
					return relativeValue;
			}();
			/*
			* Adiciona container para o gráfico do tipo Meter
			*/
			var chartElement = meterSource.closest(".chart")
					.addClass("meter-container text-center center-block")
					.css("max-width", chartContainerWidth + "px");
			/*
			* Adiciona o elemento acesório para descrever o resultado gráfico
			*/
			var meterSummary = chartElement.append("<div class='meter-summary'></div>").children(":last").addClass(showCanvas);
			
			meterSummary.append("<span>" + actualValue + (!meterUnit ? "" : " de ") + (isValuePercentage ? "" : maxNumber) + " " + meterUnit + "</span>");
			
			if (meterSummary.find("span").text().trim() === actualValue.trim()) {
				meterSummaryTextRate = 2;
			}
			meterSummaryTextSize = meterSummaryTextSize * meterSummaryTextRate;
			meterSummary.find("span").css("font-size", meterSummaryTextSize+"px");
			
			meterSource.addClass(hiddenSource);
		};
		
        var createChart = function(){
			var i;
            switch (options.type) {
                case "pie":
                    canvas = document.getElementById(canvasId);
                    RGraph.Reset(canvas);
                    /* Transforma dados inteiros em string para serem usados nas labels */
                    var arrdDataText = [];
                    for ( i = 0; i < arrData.length; i++ ) {
                        arrdDataText.push(arrData[i].toString());
                    }
					
                    var pie = new RGraph.Pie(canvasId, arrData)
                    .set('colors', arrColorPattern)
                    .set('title', caption + " - " + arrTitles)
                    .set('labels', arrdDataText)
                    .set('gutter.top', 50)
                    .set('key', arrTooltipsTitles)
                    .set('key.position', 'gutter')
                    .set('key.position.y', 25)
                    .set('key.interactive', true)
                    .set('shadow', false)
                    .set('labels.sticks', true)
                    .set('labels.sticks.length', 5)
                    .set('tooltips.event', 'onmousemove')
                    .set('tooltips', arrTooltipsTitles)
                    .draw();
                    $(element.closest(".chart")).on('resize' + eventNamespace, function () {
                        chartResize(canvas, pie);
                    });
                    break;
                case "line":
                    canvas = document.getElementById(canvasId);
                    RGraph.Reset(canvas);					
									
					var line = new RGraph.Line(canvasId, arrData)
						.set('colors', arrColorPattern)
						.set('title', caption)
						.set('title.y', 20)
						.set('gutter.left', 35)
						.set('gutter.top', 60)
						.set('shadow', false)
						.set('background.grid', false)
						.set('labels', arrSubTitles)
						.set('tooltips', arrTooltipsTitles)
						.set('tooltips.event', 'onmousemove');						
					if(arrTitles.length){
						line
						.set('key', arrTitles)
						.set('key.interactive', true)
						.set('key.position', 'gutter')
						.set('key.position.y', 25);
					}
					line.draw();
					
                    $(element.closest(".chart")).on('resize' + eventNamespace, function () {
                        chartResize(canvas, line);
                    });
                    
                    break;				
					
                case "bar":
                    canvas = document.getElementById(canvasId);
                    RGraph.Reset(canvas);
					
					
                    var bar = new RGraph.Bar(canvasId, arrData)
                    .set('colors', arrColorPattern)
                    .set('title', caption)
                    .set('title.y', 20)
                    .set('gutter.left', 35)
                    .set('gutter.top', 60)
                    .set('shadow', false)
                    .set('background.grid', true)
                    .set('labels', arrSubTitles)
                    .set('tooltips', arrTooltipsTitles)
                    .set('tooltips.event', 'onmousemove')
                    .set('key', arrTitles)
                    .set('key.interactive', true)
                    .set('key.position', 'gutter')
                    .set('key.position.y', 25)
                    .draw();
                    $(element.closest(".chart")).on('resize' + eventNamespace, function () {
                        chartResize(canvas, bar);
                    });
                    
                    break;
					
                case "meter":
                    canvas = document.getElementById(canvasId);
                    RGraph.Reset(canvas);
					
					var meter = new RGraph.Meter(canvasId, 0, 100, meterValue)
						.set('background.color', 'transparent')
						.set('border', false)
						.set('text.font', 'Source Sans Pro')
						.set('text.size', textSize)
						.set('title', meterLabel)
						.set('title.font', 'Verdana')
						.set('title.hpos', 'center')
						.set('title.vpos',0.5)
						.set('green.color', '#a2b86c')
						.set('green.start', secondRangeTop)
						.set('green.end', 100)
						.set('yellow.color', '#ecaa38')
						.set('yellow.start', firstRangeTop)
						.set('yellow.end', secondRangeTop - 1)
						.set('red.color', '#c02e1d')
						.set('red.start', 0)
						.set('red.end', firstRangeTop - 1)
						.set('tickmarks.small.num', 0)
						.set('tickmarks.big.num', 0)
						.set('needle.color', '#333')
						.set('needle.radius', needleRadius)
						.set('radius', meterRadius)
						.set('segment.radius.start', segmentRadius)
						.set('labels', false)
						.set('centerpin.fill', '#333')
						.set('gutter.right', 0)
						.set('gutter.left', 0)
						.set('gutter.top', chartContainerHeight * 0.12)
						.set('gutter.bottom', chartContainerHeight * 0.05)
						.draw();
					
                    $(element.closest(".chart")).on('resize' + eventNamespace, 
						function () {chartResize(canvas, meter);});
					break;
            }
        };
        /*
         * Implementação do plugin (o que o plugin faz ou estende ao comportamento de outro)
         */
        /* Cria estrutura para a inserção do gráfico */
        createChartContainers();
        /*
        * Cria atributo data-title nas tr's da tabela
        * para ser utilizado pela classe CSS no-more-tables
        * que transforma cada linha da tabela em visualização de cartões
		* *** Apenas para gráfico que usam tabelas como base
        */
		if (options.type !== "meter" ) {createDataTitle();}
        /* Busca os dados contidos na tabela para alimentar os gráficos */
		if (options.type !== "meter" ) {

			checkTable(element);
		}
        /* Busca os dados contidos na marcação para alimentar os gráficos do tipo meter */
		if (options.type === "meter" ) {
			setMeterDimensions(chartContainerWidth);
			getMeterChartData();
		}
		
		/*
        * Instância Rgraph, seta parâmetros para o plguin
        * e cria gráficos de acordo com o tipo
        */
        createChart();
    };
	
    Chart.prototype = {
        name: 'Chart',
        defaults: {
            transformBreakpoint: "xs",
			rangesMarks: [20,80]
        },
        domains: {
            type: ["bar", "pie", "meter", "line"],
            transformBreakpoint: ["xs", "sm", "md", "lg"]
        }
    };
    /*
     * Solicita o registro do widget
     */
    PIC.widgetRegister(Chart);
})(jQuery, window, document);
})();
/* Início de novo arquivo concatenado */
(function () {/* Carousel */
/**
Transforma uma lista, ou algum outro conjunto de elementos (divs, sections, articles) em um carrossel.

@module Carousel
@attribute data-pic-carousel
@example
<div data-pic-carousel>
    <div>
        Conteúdo 1...
    </div>
    <div>
        Conteúdo 2...
    </div>
    <div>
        Conteúdo 3...
    </div>
</div>

*/

;(function ($, window, document, undefined) {

    'use strict';

    /*
     * Variáveis globais
     */

    /*
     * Sobrescrevendo os valores default do plugin que está sendo estendido.
     * Esses valores que servem para todas as instâncias do plugin.
     */


    /*
     * Definição da classe
     */
    var Carousel = function (widgetHelper) {

        var name = this.name,
            element = widgetHelper.element,
            options = widgetHelper.options,
            eventNamespace = widgetHelper.eventNamespace,
            contents,
            numItens;


         /*
         * Métodos públicos
         */

        this.destroy = function () {

            widgetHelper.clearEvents();

            // Devolve a visibilidade de conteúdos escondidos
            contents.removeClass('hidden');

            // Remover atributos WAI-ARIA
            element.find('.owl-item').removeAttr('aria-hidden aria-labelledby');

            // Remover id da paginação
            element.find(".carousel-num-page").removeUniqueId();

            // Remover paginação
            element.children('.paginationContainer').remove();

            // Remover id dos itens
            element.find('.owl-item').removeUniqueId();

            // Destruir o owlCarousel
            element
                .trigger('destroy.owl.carousel')
                .removeClass('owl-carousel owl-theme');

        };

        /*
         * Métodos privados
         */

        var pageExchange = function(){
            element.find(".paginationContainer>.pagination .page").each(function (){
                if($(this).hasClass("active")){
                    $(this).children().attr({
                        "tabindex": "0",
                        "aria-selected": "true"
                    }).focus();
                    $(this).closest("div").children().first().
                    text("Carousel página " + ($(this).index()) +" de " + numItens);
                }else{
                    $(this).children().attr({
                        "tabindex": "-1",
                        "aria-selected": "false"
                    });
                }
            });

            element.find(".owl-item").each(function (){
                if($(this).hasClass("active")){
                    $(this).attr({
                        "aria-hidden": "true"
                    });
                }else{
                    $(this).attr({
                        "aria-hidden": "false"
                    });
                }
            });
        };

        // Ativa e desativa itens de paginação
        var activatePagingItem = function(numItem){
            pager.children().removeClass("active");
            pager.children("li:eq("+numItem+")").addClass("active");
        };


        var nextPrevBtnControler = function(numItem, pageCount){
            if(numItem > 1){
                pager.children(".prev").removeClass("disabled");
            }else{
                pager.children(".prev").addClass("disabled");
            }

            if(numItem === pageCount){
                pager.children(".next").addClass("disabled");
            }else{
                pager.children(".next").removeClass("disabled");
            }
        };

        // Vai para próxima página
        var next = function(e){
            element.trigger('next.owl.carousel');
            pageExchange();
            e.preventDefault();
        };

        // Vai para página anterior
        var prev = function(e){
            element.trigger('prev.owl.carousel');
            pageExchange();
            e.preventDefault();
        };

        // Calcula qual é a altura máxima para cada item de acordo
        // com a altura máxima encontrada dentre os ítens
        var itemMaxHeight = function(obj){

            var itemHeightInit,
                itemHeightEnd = 0,
                percentHeighIE8;

            element.find(".owl-item").each(function(i){
                itemHeightInit = $(this).actual("outerHeight");

                /* Se browser for IE 8 calcula 20% da alturado item atribui valor a
                * variável percentHeighIE8 que será somada a maior altura final encontrada
                * para sanar bug ao buscar a altura real do item encontrado no IE8
                */
                percentHeighIE8 = ($.browser.msie === true && $.browser.versionNumber === 8) ? itemHeightInit/100*20 : percentHeighIE8 = 0;
                if(itemHeightInit > itemHeightEnd){
                    itemHeightEnd = itemHeightInit;
                }
            });

            /* Se não for IE8 percentHeighIE8 será igual a zero */
            return itemHeightEnd + percentHeighIE8;
        };

        var showOnly = function (collection, item) {
            collection.addClass('hidden');
            collection.eq(item).removeClass('hidden');
        };

        /*
        * Configurações feitas na inicialização do plugin
        */

        // Evento Initialized
        element.on('initialized.owl.carousel'+eventNamespace, function(event) {
            numItens = event.item.count/event.page.size;
        }).addClass("owl-carousel owl-theme");

        /*
         * Instanciação do plugin que está sendo estendido.
         */
        element.owlCarousel({
            autoplay: false,
            autoplayTimeout: 10000,
            loop: false,
            items: 1,
            dots: true,
            nav: false
        });

        /*
         * Implementação do plugin (o que o plugin faz ou estende ao comportamento de outro)
         */
        contents = element.find('.owl-item').children();
        showOnly(contents, 0);

        /*
         * Eventos
         */

        // Quando inicia uma transição, mostra todo o conteúdo
        element.on('translate.owl.carousel' + eventNamespace, function (e) {
            contents.removeClass('hidden');
        });

        // Quando inicia uma transição (arrastando), mostra todo o conteúdo
        element.on('drag.owl.carousel' + eventNamespace, function (e) {
            contents.removeClass('hidden');
        });

        // Quando termina a transição, mostra apenas o item efetivamente visível
        element.on('translated.owl.carousel' + eventNamespace, function (e) {
            showOnly(contents, e.item.index);
        });

        // Faz o resize do carousel de acordo com a alteração do seu tamanho com relação ao documento
        element.on('resize'+eventNamespace, function () {
            element.data("owl.carousel")._invalidated.width = true;
            element.trigger('refresh.owl.carousel');
        });

        // Configurações feitas na mudança de páginas
        element.on('changed.owl.carousel'+eventNamespace, function(event) {
            var incremento = 1,
                numItem = event.item.index + incremento;
            activatePagingItem(numItem);
            nextPrevBtnControler(numItem, event.page.count);
        });

        // Remove itens desabilitados para o uso
        element.find(".paginationContainer .disabled").remove();
        element.find(".owl-dots").remove();

        // Atribui id aos itens de conteúdo do carousel
        element.find(".owl-item").uniqueId();

        // Cria paginação
        // Cria lista de itens paginados logo após os itens do carousel
        element.prepend("<div class=\"paginationContainer\"><ul role=\"tablist\" class=\"pagination\"></ul></div>");
        var pager = element.find(".paginationContainer>.pagination");

        // Parágrafo escondido para inserção de dados
        // dinâmicos a serem lidos pelo leitor de tela
        element.find(".paginationContainer").prepend("<p class='sr-only' aria-live='polite'>Carousel página 1 de "+ numItens +"</p>");

        // Insere linhas relativas a cada item do carousel na lista de paginação
        // e marcações WAI-ARIA
        element.find(".owl-item").each(function(i){
            pager.append("<li class=\"page\">" +
            "<a tabindex=\"-1\"" +
            "aria-selected=\"false\"" +
            "aria-controls="+ $(this).attr("id") + "\ " +
            "href=\"#\" class=\"carousel-num-page\">" + (i + 1) + "</a></li>");
        }).css("height", itemMaxHeight());

        pager.children().first().addClass("active").children().attr({
            "tabindex": "0",
            "aria-selected": "true",
            "aria-controls":  $(this).attr("id")
        });

        //Atribui id aos itens de paginação
        element.find(".carousel-num-page").uniqueId();

        // Logo depois de popular a lista insere linha para item anterior
        // em primeiro lugar na lista e por último insere linha para próxima item
        if (options.type === 'default') {
            pager.prepend("<li class=\"prev disabled\"><a tabindex=\"-1\" href=\"#\"><span class=\"glyphicon glyphicon-menu-left\"></span><span class=\"posicao\">Anterior</span></a></li>");
            pager.append("<li class=\"next\"><a tabindex=\"-1\" href=\"#\"><span class=\"posicao\">Próxima</span><span class=\"glyphicon glyphicon-menu-right\"></span></a></li>");
        }

        // Insere marcações WAI-ARIA
        element.find(".owl-item").each(function(i){
            i++;
            if($(this).hasClass("active")){
                $(this).attr("aria-hidden", "false");
            }else{
                $(this).attr("aria-hidden", "true");
            }

            $(this).attr({
                "aria-labelledby": pager.children("li:eq("+i+")").children().attr("id")
            });
        });


        /*
         * Triggers
         */

        // Cria trigger para passar para o próximo item, link Próxima
        element.find(".paginationContainer .next").on('click'+eventNamespace, function(e) {
            if(!$(this).hasClass("disabled")) {
                next(e);
            }
        });

        // Cria trigger para voltar para o item anterior, link Anterior
        element.find(".paginationContainer .prev").on('click'+eventNamespace, function(e) {
            if(!$(this).hasClass("disabled")) {
                prev(e);
            }
        });

        // Rotina para mudança de itens no evento click nos números de paginação
        // ou dots caso sejam criados
        element.find(".carousel-num-page").each(function(i) {
            $(this).on('click'+eventNamespace, function(e){
                element.trigger('to.owl.carousel', [i]);
                pageExchange();
                e.preventDefault();
            });
        });
        /* * */

        // Configura navegação por teclado
        element.on('keydown'+eventNamespace, '.paginationContainer>.pagination li', function(e){
            var keyCode = e.which;

            switch(keyCode){
                case key.right:
                case key.down:
                    $(this).trigger('next.owl.carousel');
                    pageExchange();
                    e.preventDefault();
                    break;
                case key.left:
                case key.up:
                    element.trigger('prev.owl.carousel');
                    pageExchange();
                    e.preventDefault();
                    break;
                case key.home:
                    element.trigger('to.owl.carousel', [0]);
                    pageExchange();
                    e.preventDefault();
                    break;
                case key.end:
                    element.trigger('to.owl.carousel', [numItens-1]);
                    pageExchange();
                    e.preventDefault();
                    break;
            }
        });
    };

    Carousel.prototype = {

        name: 'Carousel',

        defaults: {
            type: 'default'
        },

        domains: {
            type: ['default', 'form']
        }
    };

    /*
     * Solicita o registro do widget
     */
    PIC.widgetRegister(Carousel);

})(jQuery, window, document);

})();
/* Início de novo arquivo concatenado */
(function () {/* Accordion */
/**
Transforma listas ou conjuntos de divs em accordion.

@module Accordion
@attribute data-pic-accordion
@param {number} [openItem=1] - Indica qual item deve iniciar aberto.
@example <caption>Accordion de um conjunto de divs</caption>
<div data-pic-accordion>
    <div>
        <div class="accordionTitle">Seção 1</div>
        <div class="accordionContent">Conteúdo da seção 1</div>
    </div>
    <div>
        <div class="accordionTitle">Seção 2</div>
        <div class="accordionContent">Conteúdo da seção 2</div>
    </div>
    <div>
        <div class="accordionTitle">Seção 3</div>
        <div class="accordionContent">Conteúdo da seção 3</div>
    </div>
</div>

@example <caption>Accordion de um a lista, mostrando o segundo item aberto</caption>
<ul data-pic-accordion='{"openItem" : "2"}'>
    <li>
        <div class="accordionTitle"></div>
        <div class="accordionContent"></div>
    </li>
    <li>
        <div class="accordionTitle"></div>
        <div class="accordionContent"></div>
    </li>
</ul>

@example <caption>Accordion de articles em um section</caption>
<section data-pic-accordion>
    <article>
        <div class="accordionTitle"></div>
        <div class="accordionContent"></div>
    </article
    <article>
        <div class="accordionTitle"></div>
        <div class="accordionContent"></div>
    </article
</section>
*/
;(function ($, window, document, undefined) {

    'use strict';

    /*
     * Definição da classe
     */
    var Accordion = function (widgetHelper) {
       /*
         * Variáveis de instância
         * Defina todas aqui antes de usar
         */
        var name = this.name,
            element = widgetHelper.element,
            options = widgetHelper.options,
            eventNamespace = widgetHelper.eventNamespace,
            numContainer = 0,
            blocks,
            titles,
            contents,
            openItem;

        /*
         * Métodos públicos
         */

        this.destroy = function () {

            widgetHelper.clearEvents();

            titles
                .removeAttr('role aria-selected aria-expanded tabindex aria-controls')
                .removeUniqueId();

            contents
                .removeAttr('role aria-hidden aria-labelledby style')
                .removeClass('collapse in')
                .removeUniqueId();

            blocks
                .removeClass('accordionBlock active');

            element
                .removeAttr('role aria-multiselectable')
                .removeClass('accordionContainer');

        };

        /*
         * Métodos privados
         */

        /*
         * Implementação do plugin
         */

        element.attr({
            "role": "tablist",
            "aria-multiselectable": "true"
        }).addClass("accordionContainer").children().addClass("accordionBlock");

        // Armazena os elementos fundamentais para o accordion: blocks, titles e contents
        blocks = element.find('> .accordionBlock');
        titles = element.find('> .accordionBlock > .accordionTitle');
        contents = element.find('> .accordionBlock > .accordionContent');

        // Remove inserções de class in diretamente no html
        contents.removeClass("in");

        // Quantidade de conteúdos no accordion
        numContainer = contents.length;
        // Item que deve estar inicialmente aberto
        openItem = options.openItem;

        // Se o item indicado para estar aberto não está na faixa possível
        // (entre 1 e a quantidade de conteúdos), avisa e retorna ao padrão
        if (openItem > numContainer || openItem < 1 ) {
            console.warn("Accordion: valor informado para o parâmetro \"openItem\" (" + openItem + ") é inválido. Assumindo valor default.", element);
            openItem = this.defaults.openItem;
        }

        // Mudando índice de base-1 para base-0
        openItem--;

        contents
            .addClass('collapse')
            .uniqueId();

        // Insere class in de acordo com o item aberto
        contents.eq(openItem).addClass('in');

        titles
            .attr({
                "role": "tab",
                "aria-selected": "false",
                "aria-expanded": "false",
                "tabindex":  "-1",
            })
            .uniqueId();

        contents.attr({
            "role": "tabpanel",
            "aria-hidden": "true"
        });

        // Para cada título do accordion
        titles.each(function (i) {

            // Indica que o title controla o content correspondente (mesmo índice)
            $(this).attr({
                "aria-controls": contents.eq(i).attr("id")
            });

            // Indica que o content é rotulado pelo title correspondente
            contents.eq(i).attr({
                "aria-labelledby": $(this).attr("id"),
            });
        });

        // Ajusta o bloco correspondente ao item aberto
        blocks.eq(openItem).addClass("active");

        // Ajusta o título correspondente ao item aberto
        titles.eq(openItem).attr({
            "aria-expanded": "true",
            "aria-selected": "true",
            "tabindex": "0"
        });

        // Ajusta o conteúdo correspodente ao item aberto
        contents.eq(openItem).attr({
            "aria-hidden": "false"
        });


        // Eventos

        element.on('show.bs.collapse'+eventNamespace, function (e) {

            // Esconde qualquer outro conteúdo que esteja visível
            contents.filter('.in').collapse('hide');
            // Evita que um Accordion interfira em outro
            e.stopPropagation();
        });

        contents.on('hide.bs.collapse'+eventNamespace, function (e) {

            var pos = contents.index(this);

            // Ajusta o content
            $(this).attr("aria-hidden", "true");

            // Ajusta o title correspodente
            titles.eq(pos).attr({
                "aria-expanded": "false",
                "aria-selected": "false",
                "tabindex": "-1"
            });

            // Evita que um Accordion interfira em outro
            e.stopPropagation();
        });

        titles.on('click'+eventNamespace, function (e) {

            var pos = titles.index(this);

            // Ajusta o title
            $(this).attr({
                "aria-expanded":"true",
                "aria-selected": "true",
                "tabindex": "0"
            });

            // Mostra o content correspondente
            contents.eq(pos).collapse('show');
            contents.eq(pos).attr({
                "aria-hidden": "false"
            });

            // Mantém a classe 'active' apenas no block correspondente
            blocks.removeClass("active");
            blocks.eq(pos).addClass("active");

            e.preventDefault();
        });

        // Navegação por teclado
        titles.on('keydown'+eventNamespace, function (e) {

            var keyCode = e.which,
                limitPos = blocks.length - 1,
                currentPos = titles.index(this),
                newPos = false;

            // Se a tecla CTRL estiver pressionada, não faz nada aqui.
            if (e.ctrlKey) {
                return;
            }

            switch (keyCode) {

                case key.right:
                case key.down:
                    // Nova posição é a próxima, ou a primeira já está no limite
                    newPos = (currentPos < limitPos) ? currentPos+1 : 0;
                    break;

                case key.left:
                case key.up:
                    // Nova posição é a anterior, ou a limite se ja está na primeira
                    newPos = (currentPos > 0) ? currentPos-1 : limitPos;
                    break;

                case key.end:
                    // Nova posição é a limite
                    newPos = limitPos;
                    break;

                case key.home:
                    // Nova posição é a primeira
                    newPos = 0;
                    break;

                case key.space:
                case key.enter:
                    e.preventDefault();
                    $(this).click();
                    break;
            }

            // Se uma nova posição foi definida,
            // ou seja, um novo title está sendo selecionado
            if (newPos !== false) {

                // Ajusta o title atual
                $(this).attr({
                    tabindex: "-1",
                    "aria-selected": "false"
                });

                // Ajusta o novo title, e move o foco para ele
                titles.eq(newPos)
                    .focus()
                    .attr({
                        "tabindex": "0",
                        "aria-selected": "true"
                    });

                e.preventDefault();
            }
        });

        contents.on('keydown'+eventNamespace, function (e) {

            var keyCode = e.which,
                pos = contents.index(this);

            if (e.ctrlKey) {

                switch (keyCode) {

                    // CTRL+UP ou CTRL+left no content
                    // Faz com que o title correspondente seja selecionado
                    case key.left:
                    case key.up:

                        // Ajusta como não selecionado todos os titles
                        titles.attr({
                            tabindex: "-1",
                            "aria-selected": "false"
                        });

                        // Ajusta como selecionado o title correspondente
                        titles.eq(pos)
                            .focus()
                            .attr({
                                "tabindex": "0",
                                "aria-expanded": "true"
                            });

                        e.preventDefault();
                        e.stopPropagation();
                        break;
                }
            }
        });
    };

    Accordion.prototype = {

        name: 'Accordion',

        defaults: {
            openItem: 1
        }
    };


    /*
     * Solicita o registro do widget
     */
    PIC.widgetRegister(Accordion);

})(jQuery, window, document);

})();
/* Início de novo arquivo concatenado */
(function () {/* Fileinput */
/**
Transforma um `input` do tipo `file` em um `Fileinput`, que possui um pouco mais de recursos, como o botão para remover arquivos.

@module Fileinput
@attribute data-pic-fileinput
@example
<div class="form-group">
    <label for="arquivo">Selecione um arquivo</label>
    <input id="arquivo" data-pic-fileinput type="file" name="meuArquivo" class="form-control">
</div>

*/
(function ($, window, document, undefined) {

    'use strict';

    /*
     * Variáveis globais
     * no escopo da closure
     */

    /*
     * Executa apenas uma vez, na carga da página
     */

    /*
     * Definição da classe
     */
    var Fileinput = function (widgetHelper) {

        /*
         * Variáveis de instância
         */
        var name = this.name,
            element = widgetHelper.element,
            options = widgetHelper.options,
            eventNamespace = widgetHelper.eventNamespace,
            browseButton,
            removeButton,
            srDescription,
            inputFile;

        /*
         * Destroy
         */
        this.destroy = function () {
            // Desabilita os listeners de eventos
            widgetHelper.clearEvents();

            // Removendo botões e input-group-btn
            browseButton.remove();
            removeButton.remove();
            element.next().remove();

            // Removendo container de element e botões (input-group)
            element.unwrap();

            // Removendo descrição acessível
            srDescription.remove();

            // Removendo inputFile criado dinamicamente
            inputFile.remove();

            // Devolvendo o atributo 'name' para o input original
            element.attr('name', inputFile.attr('name'));
            inputFile.attr('name', '');

            // Transformando input original de volta de text para file
            element.removeClass('fileinput__facade');
            element.removeAttr('readonly');
            element.attr('type', 'file');
        };

        var enhanceAccessibility = function () {

            // Atributos do botão "Procurar..."
            browseButton.attr({
                "tabindex": "-1",
                "aria-label": "Procurar arquivo no seu sistema",
                "aria-controls": element.attr("id")
            });

            // Atributos do botão "Remover"
            removeButton.attr({
                "tabindex": "-1",
                "aria-label": "Remover seleção de arquivo"
            });

            // Pressionamento de teclas no elemento principal
            element.on("keydown" + eventNamespace, function (e) {

                // Leva o foco para o botão à direita ao pressionar tecla para baixo ou para a direita
                if (e.which === key.right || e.which === key.down) {

                    e.preventDefault();

                    if (removeButton.is(":visible")) {
                        removeButton.focus();
                    } else {
                        browseButton.focus();
                    }
                // Simula o click no seletor de arquivo ao pressionar enter
                } else if (e.which === key.enter) {

                    e.preventDefault();
                    inputFile.click();

                }
            });

            // Pressionamento de teclas no botão limpar
            removeButton.on("keydown" + eventNamespace, function (e) {
                var keyCode = e.which;
                switch (keyCode) {
                    // Leva o foco para o botão "procurar" ao pressionar tecla para baixo ou para a direita
                    case key.right:
                    case key.down:
                        e.preventDefault();
                        browseButton.focus();
                        break;
                    // Leva o foco para o elemento principal ao pressionar tecla para cima ou para a esquerda
                    case key.left:
                    case key.up:
                        e.preventDefault();
                        element.focus();
                        break;
                }
            });

            // Pressionamento de teclas no botão "procurar"
            browseButton.on("keydown" + eventNamespace, function (e) {

                // Leva o foco para o elemento à esquerda ao pressionar tecla para baixo ou para a direita.
                if (e.which === key.left || e.which === key.up) {

                    e.preventDefault();

                    if (removeButton.is(":visible")) {
                        removeButton.focus();
                    } else {
                        element.focus();
                    }
                }
            });
        }

        var setFilename = function (fileName) {

            element.val(fileName);
            srDescription.text(fileName === '' ? 'Nenhum arquivo selecionado' : 'Arquivo selecionado: ' + fileName);
        }

        /*
         * Implementação do widget (o que o widget faz ou estende ao comportamento de outro)
         */
        function init() {

            var root = $('<div class="input-group"></div>');

            inputFile = $('<input type="file" class="form-control">');

            // Transforma o input file original em input text
            /* Essa foi a solução menos "intrusiva", ou seja, que mais preserva o HTML original
               fornecido pelo programador. Com isso, a validação de formulários, por exemplo,
               funciona melhor do que qualquer outra solução tentada (que seria criar um input text
               dinamicamente e esconder o input file original). */
            element.attr('type', 'text');
            element.attr('readonly', 'true');
            element.addClass('fileinput__facade');

            // Transfere o atributo 'name' do input original para o substituto
            inputFile.attr('name', element.attr('name'));
            element.attr('name', '');

            // Insere o input file no DOM
            inputFile.css('display', 'none');
            inputFile.insertAfter(element);

            // Cria o elemento de descrição acessível e o insere no DOM
            srDescription = $('<span aria-live="polite" class="sr-only"></span>');
            srDescription.insertBefore(element);

            // Prepara container para element e botões
            element.wrap(root);

            // Criando os botões
            removeButton = $('<button class="btn btn-secondary fileinput__button fileinput__button--remove hidden" type="button"><i class="glyphicon glyphicon-trash"><span class="fileinput__button-label">Remover</span></i></button>');
            browseButton = $('<button class="btn btn-primary fileinput__button fileinput__button--browse" type="button"><i class="glyphicon glyphicon-folder-open"></i><span class="fileinput__button-label">Procurar…</span></button>');
            // Cria um container e insere nele os botões
            element.after('<span class="input-group-btn"></span>');
            element.next().append(removeButton);
            element.next().append(browseButton);

            // Controlando estado de desabilitado
            // Se o element estava desabilitado, faz com que o botão "procurar" e o inputFile também estejam
            if (element.attr('disabled')) {
                browseButton.attr('disabled', 'disabled');
                inputFile.attr('disabled', 'disabled');
            }

            setFilename('');

            element.on('focus' + eventNamespace, function () {
                // Desfazendo a seleção "padrão" que o navegador faz do texto no input.
                $(this).get(0).setSelectionRange(0, 0);
            });

            // Clique no botão "Procurar" provoca clique no inputFile
            browseButton.on('click' + eventNamespace, function () {
                inputFile.click();
            });

            // Clique no botão "Remover" limpa arquivo selecionado
            removeButton.on('click' + eventNamespace, function () {
                inputFile.val(null);
                inputFile.trigger('change');
                element.focus();
            });

            // Na modificação do inputFile, mostra a informação no element (que está visível)
            inputFile.on('change' + eventNamespace, function () {

                setFilename(inputFile.val().split('\\').pop());
            });

            // Verifica valor do inputFile e aplica regra de exibição do botão de remoção de arquivo
            inputFile.on('change' + eventNamespace, function () {
                if (inputFile.val() !== "") {
                    removeButton.removeClass("hidden");
                } else if (inputFile.val() === "" || inputFile.val() == undefined || inputFile.val() == null) {
                    removeButton.addClass("hidden");
                }
            });

            enhanceAccessibility();
        }

        init();
    };


    Fileinput.prototype = {
        name: 'Fileinput',
    };

    /*
     * Solicita o registro do widget
     */
    PIC.widgetRegister(Fileinput);

})(jQuery, window, document);
})();
/* Início de novo arquivo concatenado */
(function () {/* Validation */
/**
Ativa a validação de campos de formulário.

Ao ativar a validação e definir as regras que os campos devem seguir, o Validation
cuida de verificar essas regras, permitindo a submissão do formulário apenas se todos os
campos forem válidos.

Há um conjunto de regras predefinidas, e outras regras podem ser criadas de acordo com
a necessidade. Veja a lista das regras existentes e como criar novas em {@tutorial validation-regras}

Para cada campo que se deseja validar, deve-se informar, no mínimo, um nome de regra de validação.
É possível informar mais de uma regra para um campo, e ele será considerado válido se atender
a *todas* as regras.

Além disso, é possível definir mensagens específicas para as regras em um campo. Quando há uma
mensagem associada a uma regra, caso essa regra não seja atendida, essa mensagem será mostrada,
em vez da mensagem padrão da regra.

@complement Configuração_interna

- `validate`:
  Nome da regra ou array com nomes das regras que devem ser validadas.

- `msg`:
  Mensagem de erro associada a uma regra, para um campo específico.

As regras e mensagens podem ser informadas para o campo de diferentes formas.
São as seguintes possibilidades:

1. `data-pic-validation-config='{"validate" : "nomeRegra"}'`

   Essa é a forma mais simples, em que o campo deve a atender a uma única regra.

2. `data-pic-validation-config='{"validate" : ["nomeRegra1", "nomeRegra2"]}'`

   Se o campo precisar atender a mais de uma regra, o valor de `"validate"` deve ser um array contendo os nomes das regras.

3. `data-pic-validation-config='{"validate" : "nomeRegra", "msg" : "Minha mensagem para esse campo"}'`

   Se for necessário definir uma mensagem específica, acrescente a chave `"msg"` ao objeto, contendo a mensagem associada à regra.

4. `data-pic-validation-config='[{"validate" : "nomeRegra1", "msg" : "Mensagem 1"}, {"validate": "nomeRegra2", "msg" : "Mensagem 2"}, {"validate": "nomeRegra3"}]'`

   Se o campo precisar atender a mais de uma regra, e ao menos uma das regras precisar de uma
   mensagem específica, a configuração deve ser montada como um array em que cada posição é um
   objeto `{"validate", "msg"}`. A chave `"msg"` pode ser omitida quando não for necessária.

@module Validation
@attribute data-pic-validation
@example
<form data-pic-validation>
    <div class="form-group">
        <label for="nome">Nome</label>
        <input data-pic-validation-config='{"validate": "required"}' id="nome" name="nome" type="text" class="form-control">
    </div>
    <div class="form-group">
        <label for="endereco">Email</label>
        <input data-pic-validation-config='{"validate": "email"}' id="endereco" name="endereco" type="email" class="form-control">
    </div>
    <input type="submit" value="Confirmar" />
</form>
*/


/**
 * Esse evento é útil para acompanhar o processo de validação do formulário.
 *
 * O handler associado a esse evento saberá que a validação do formulário foi concluída,
 * e em que campos foram encontrados erros.
 *
 * É especialmente útil em conjunção com o método [`validate()`]{@link module:Validation#validate},
 * permitindo ao desenvolvedor controlar o processo de validação e submissão do formulário.
 *
 * Disparado sempre que a validação é concluída, havendo ou não erros no formulário.
 *
 * @event pic:validationCompleted
 * @param {array} fields - Lista de campos com erro. Cada elemento da lista é um elemento do DOM.
 *        Uma lista vazia indica que não há erros no formulário.
 *
 */

;(function ($, window, document, undefined) {

    'use strict';

    /*
     * Variáveis globais
     * no escopo da closure
     */
    var rules = {},
        // O FormValidator trata de forma especial a regra 'notBlank', de modo que não é trivial
        // criar uma regra com outro nome que a substitua ou funcione como ela.
        // A solução foi criar um apelido (alias) para ela, de forma que o usuário do Validation
        // possa usar esse apelido, e o widget faça a tradução necessária.
        NOTBLANK_ALIAS = 'required';

    // Recebe um string nos formatos 'y-m-d' ou 'd/m/y' e converte em um objeto no formato
    // {
    //    year,   <--- com o valor de y
    //    month,  <--- com o valor de m
    //    day     <--- com o valor de d
    // }
    var parseDate = function (str) {
        var parts,
            date = false;

		str = str || '';

        if (str.indexOf('-') !== -1) {

            parts = str.split('-');

            if (parts.length === 3) {
                date = {
                    year:   parts[0],
                    month:  parts[1],
                    day:    parts[2]
                };
            }

        } else if (str.indexOf('/') !== -1) {

            parts = str.split('/');
            if (parts.length === 3) {
                date = {
                    year:   parts[2],
                    month:  parts[1],
                    day:    parts[0]
                };
            }
        }
        return date;
    };

    // Retorna a label associada a um campo do formulário
    // Note que a label deve estar associado pelo atributo "for" para ser achada
    function getLabel(field, container) {
        if (field.is("fieldset")) {
            return field.find("legend:eq(0)");
        }
        var id = field.attr("id");
        if (!id) {
            return field;
        }
        return $("label[for=" + id + "]", container);
    }

    // Formata uma string, substituindo "%s" pelos respectivos parâmetros
    function getFormattedString(rawStr, params) {
        if (!params || params.length == 0) {
            return rawStr;
        }
        if (!(params instanceof Array)) {
            params = [params];
        }
        var placeHolders = rawStr.split("%s");
        var str = "";
        if (placeHolders.length <= 1) {
            return rawStr;
        }
        $.each(placeHolders, function(i){
            str += placeHolders[i];
            if (params[i]) {
                str += params[i];
            }
        });
        return str;
    }

    // Substitui oldStr por newStr em text
    // Considera que text é um string composto de uma ou mais palavras
    // (separadas por espaço em branco), e que oldStr é uma das palavras
    // em text. Se oldStr não for encontrado, retorna text sem alterações.
    function replace(text, oldStr, newStr) {
        var tokens = text.split(' '),
            index;

        index = tokens.indexOf(oldStr);
        // Se oldStr já existe
        if (index !== -1) {
            // Substitui
            tokens[index] = newStr;
        }
        // Retorna o texto com o token substituído
        return tokens.join(' ');
    }

    /*
     * Funções personalizadas de validação
     */
    // Indica erro se a data inicial for maior do que a final.
    // @TODO Tornar essa função mais robusta:
    //       Foi concebida para funcionar com navegadores que retornam a data dos input date
    //       nos formatos yyyy-mm-dd ou dd/mm/yyyy.
    //       Qualquer coisa diferente disso pode fazer com que ela funcione de forma inesperada.
    var validaPeriodo = function (value, fieldset) {

        var ini = {},
            fim = {},
            temIni,
            temFim,
			inputFields;

		// Verifica se o fieldset trabalha com campos do tipo text, prioritariamente, ou date
		inputFields =  fieldset.find('input[type=text]');
		if (inputFields.length < 1) {
			inputFields =  fieldset.find('input[type=date]');
		}

        // Assume que, nesse fieldset, o primeiro input date é o início, e o segundo é o fim
        ini.input = inputFields.filter(':eq(0)');
        fim.input = inputFields.filter(':eq(1)');
        // console.debug ('Valores recebidos: ', ini.input.val(), fim.input.val());

        ini.date = parseDate(ini.input.val());
        fim.date = parseDate(fim.input.val());
        // console.debug(ini.date, fim.date);

        // Armazena data inicial e final de acordo com os valores dos inputs correspondentes.
        ini.date = new Date(ini.date.year, ini.date.month-1, ini.date.day);
        fim.date = new Date(fim.date.year, fim.date.month-1, fim.date.day);
        // console.debug(ini.date, fim.date);

        // Testa se os valores armazenados em .date são realmente datas.
        temIni = (ini.date instanceof Date && !isNaN(ini.date.valueOf()));
        temFim = (fim.date instanceof Date && !isNaN(fim.date.valueOf()));

        // Se são datas
        if (temIni && temFim) {

            // console.debug ('Tem inicio e fim: ', ini.date, fim.date);

            // Se a data inicial é maior do que a final
            if (ini.date.valueOf() > fim.date.valueOf()) {

                // Obtém do fieldset o texto dos labels associados aos inputs início e fim
                // por meio da relação id/for
                ini.label = fieldset.find('label[for="' + ini.input.attr('id') + '"]').text();
                fim.label = fieldset.find('label[for="' + fim.input.attr('id') + '"]').text();

                // Retorna indicando o erro e os nomes dos campos (labels) que irão compor a
                // mensagem de erro.
                return {
                    result: false,
                    params: [ini.label, fim.label]
                };
            }
        }
        // Assume que não há erro se as datas não foram informadas, ou
        // se data inicial não for maior do que a final.
        return true;
    };

    // Indica erro se nenhum campo estiver preenchido.
    // Considera-se "campo": input, select, textarea, desde que não seja type=checkbox ou type=radio.
    // Essa função está associada à regra 'required', que é aplicada (por nossa própria definição)
    // somente a fieldsets. Ver a implementação da função attributeTransform para entender maiores
    // detalhes de como isso é feito.
    var groupRequired = function (value, fieldset) {

        var anyFilled = false,
            fields = fieldset.find('input, select, textarea');

        fields.each(function (index) {

            var field = $(this);

            // Considera que há algum campo preenchido se:
            // - há algum valor informado, E
            // - o campo NÃO É nem checkbox nem radio
            if (field.val() && !(field.is(':checkbox') || field.is(':radio')))  {
                anyFilled = true;
                return false; // interrompe o each, não precisa procurar mais.
            }
        });
        // Retorna true se houver algum campo preenchido.
        return anyFilled;
    };

    // Indica erro se não for um CPF válido
    // Considera tanto o formato quanto os dígitos verificadores na validação.
    var validCPF = function (value) {

        var soma,
            resto,
            i,
            // Combina com um string de 11 dígitos, podendo ou não ter "." e "-" nos locais
            // esperados para um CPF.
            // Valida com: "12345678909", "123.456.789-09", "123456789-09"
            //             "123.456.78909", "123.456789-09", "123456.78909", etc. >> Sim, estranho, mas combina.
            regexCPF = /^[0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2}$/;

        // --- Valida o formato ---
        // Se o string informado não combina com a expressão regular.
        if (!regexCPF.test(value)) {
            return false;
        }

        // --- Despreza o formato, para validar o conteúdo ---
        //   ┌─────> ponto: \. (\ é caracter de escape)
        //   │ ┌───> hífen: -
        // /\.|-/
        // Remove do string qualquer ponto ou hífen
        value = value.replace(/\.|-/g, "");

        // --- Valida o conteúdo ---

        // Considera-se erro CPF formado por uma sequência de zeros.
        if (value === "00000000000") {
            return false;
        }

        // Primeiro dígito verificador
        soma = 0;
        for (i = 1; i <= 9; i++) {
            soma = soma + parseInt(value.charAt(i-1)) * (11 - i);
        }
        resto = (soma * 10) % 11;
        if ((resto === 10) || (resto === 11)) {
            resto = 0;
        }

        if (resto !== parseInt(value.charAt(9))) {
            return false;
        }

        // Segundo dígito verificador
        soma = 0;
        for (i = 1; i <= 10; i++) {
           soma = soma + parseInt(value.charAt(i-1)) * (12 - i);
        }
        resto = (soma * 10) % 11;
        if ((resto === 10) || (resto === 11)) {
            resto = 0;
        }

        if (resto !== parseInt(value.charAt(10))) {
            return false;
        }

        // Retorna true (válido) se passou ileso por todas as verificações.
        return true;
    };

    // Indica erro se não for um CNPJ válido
    // Considera tanto o formato quanto os dígitos verificadores na validação.
    var validCNPJ = function (CNPJ) {

        var dig13, dig14,
            soma, i, resto, num, peso,
            // Combina com um string de 14 dígitos, podendo ou não ter "." e "-"  e "/" nos locais
            // esperados para um CNPJ.
            // Valida com: "12345678000100", "12.345.678/0001-00", "12345678/0001-00", "123456780001-00"
            //             "12.345678000100", "12345.6780001-00", "12.3456780001-00", etc. >> Sim, estranho, mas combina.
            regExpCNPJ = /^[0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2}$/,
            regExRepeat = /^(0{14}|1{14}|2{14}|3{14}|4{14}|5{14}|6{14}|7{14}|8{14}|9{14})$/;

        // --- Valida o formato ---
        // Se o string informado não combina com a expressão regular.
        if (!regExpCNPJ.test(CNPJ)) {
            return false;
        }

        // --- Despreza o formato, para validar o conteúdo ---
        //   ┌────────> ponto: \. (\ é caracter de escape)
        //   │  ┌─────> barra: \/ (\ é caracter de escape)
        //   │  │ ┌───> hífen: -
        // /\.|\/|-/
        // Remove do string qualquer ponto, barra ou hífen
        CNPJ = CNPJ.replace(/\.|\/|-/g, "");

        // --- Valida o conteúdo ---

        // Considera-se erro CNPJ formado por uma sequência de numeros iguais.
        if (regExRepeat.test(CNPJ)) {
            return false;
        }

        // Cálculo do 1o. Digito Verificador
        soma = 0;
        peso = 2;
        for (i=11; i>=0; i--) {
            num = CNPJ.charAt(i);
            soma = soma + (num * peso);
            peso = peso + 1;
            if (peso === 10) {
                peso = 2;
            }
        }

        resto = soma % 11;
        if ((resto === 0) || (resto === 1)) {
            dig13 = 0;
        }
        else {
            dig13 = 11 - resto;
        }

        // Cálculo do 2o. Digito Verificador
        soma = 0;
        peso = 2;
        for (i=12; i>=0; i--) {
            num = CNPJ.charAt(i);
            soma = soma + (num * peso);
            peso = peso + 1;
            if (peso === 10) {
                peso = 2;
            }
        }

        resto = soma % 11;
        if ((resto === 0) || (resto === 1)) {
            dig14 = 0;
        }
        else {
            dig14 = 11 - resto;
        }

        // Retorna true se os dígitos verificadores informados conferem com os calculados.
        return (dig13 === parseInt(CNPJ.charAt(12)) && dig14 === parseInt(CNPJ.charAt(13)) );
    };

    // Indica erro se não for ou um CPF ou um CNPJ válido.
    // Considera tanto o formato quanto os dígitos verificadores na validação.
    var validCPForCNPJ = function (value) {
        return validCPF(value) || validCNPJ(value);
    };

    /*
     * Ajustes globais do formValidator (que não dependem das instâncias criadas)
     *
     * Para seguir o padrão do PIC, optamos por não fazer alterações no arquivo de configuração
     * do formValidator. O que poderia ser feito lá está sendo feito aqui.
     * Assim, temos maior clareza sobre o que efetivamente foi personalizado, e o código
     * de terceiros permanece intacto.
     */

    // Estendendo e configurando a linguagem
    FFM.validatorLocalizedStrings.pt_br = {
        summaryHeadingSingle : "<strong>Atenção:</strong> Seu formulário contém 1 erro",
        summaryHeadingPlural : "<strong>Atenção:</strong> Seu formulário contém %s erros.",
        errorPrefix : "<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'> </span><em class='sr-only'>Atenção:</em> ",
        errorSeparator : ": ",
        successPrefix : "Sucesso: ",
        waitingForValidation : "Validando..."
    };

    // Cabeçalho do sumário de validação
    // Esse template foi alterado para passar a usar glyphicon em vez de fontAwesome
    FFM.validatorHTMLStrings.summaryHeading = "<h2><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span></h2>";

    // Ajustando localidade para português brasileiro.
    FFM.FormValidator.currentLocale = "pt_br";

    // Customização da lógica de onde a mensagem de erro deve ser "encaixada"
    // na estrutura html do campo que está sendo validado.
    // Se a função retornar null, a mensagem é colocada na posição padrão do formValidator.
    FFM.customLogicForElementToFollow = function (field) {
        // Se for o input do widget autocomplete...
        if (field.is('[data-pic-autocomplete][data-pic-active]')) {
            // ... e estiver dentro de um .input-group...
            if (field.closest('.input-group').length) {
                // ... a mensagem deve ser mostrada após o .input-group
                return field.closest('.input-group');
            }
            // ... a mensagem deve ser mostrada após o .typeahead-container
            return field.parent(); // div.autocomplete
        }
        // Se o input estiver dentro de um .input-group (classe do Bootstrap)...
        else if (field.parent().is('.input-group')) {
            // ... a mensagem deve ser mostrada após o .input-group.
            return field.parent();
        // Se o input estiver dentro de um label (caso de checkbox ou radiobutton)...
        } else if (field.parent().is('label')) {
            // ... a mensagem deve ser mostrada após o label.
            return field.parent();
        // Se for um fieldset
        } else if (field.is('fieldset')) {
            return field.find("legend:eq(0)");
        // Se for o input do widget fileinput...
        } else if (field.is('[data-pic-fileinput]')) {
            // ... a mensagem deve ser mostrada após o .file-input
            return field.closest('.file-input');
        }

        // Retornar null indica que o local da mensagem será definido pelas regras padrão
        // do FormValidator.
        return null;
    };

    // Novas regras de validação
    rules = {
        CPF:        [ validCPF, 'Não é um número de CPF válido'],
        CNPJ:       [ validCNPJ, 'Não é um número de CNPJ válido'],
        CPFouCNPJ:  [ validCPForCNPJ , 'Não é um número de CPF ou CNPJ válido'],
        // ponto: P_1234, P_123456, D_12345. "P_" e "D_" são opcionais, e podem ser maiúsculas ou minúsculas.
        ponto:      [ /^(P_)*([0-9]{4}|[0-9]{6})$|^(D_)*[0-9]{5}$/i , 'Não é um número de ponto válido'],
        periodo:    [ validaPeriodo , '"%s" deve ser anterior a "%s"'],
        // Aqui, required corresponde também à string definida em NOTBLANK_ALIAS
        required:   [ groupRequired, "Preencha ao menos um dos campos."]
    };
    // Adiciona as novas regras às já existentes.
    $.extend(true, FFM.defaultValidatorRules, rules);

    // Para regras já existentes, fazer apenas a tradução necessária
    FFM.defaultValidatorRules.notBlank[1] = 'Campo obrigatório';
    FFM.defaultValidatorRules.email[1] = 'Não é um endereço de e-mail válido';
    FFM.defaultValidatorRules.checked[1] = 'Marque essa opção antes de continuar';
    FFM.defaultValidatorRules.checkboxGroupRange[1] = 'Marque entre %s e %s dessas opções"';
    FFM.defaultValidatorRules.checkboxGroupMinimum[1] = 'Marque ao menos %s dessas opções"';
    FFM.defaultValidatorRules.checkboxGroupMaximum[1] = 'Marque no máximo %s dessas opções"';

    /*
     * Definição da classe
     */
    var Validation = function (widgetHelper) {

        /*
         * Variáveis de instância
         * Defina todas aqui antes de usar
         */
        var name = this.name,
            element = widgetHelper.element,
            options = widgetHelper.options,
            eventNamespace = widgetHelper.eventNamespace,
            instanceId = widgetHelper.instanceId,
            submitButtons,
            clickedButton = null,
            formValidator,
            fieldsToValidate, // Lista de campos que possuem regras de validação associadas.
            fieldRules = [],  // Lista de regras correspondentes a cada um dos campos.
            timeoutIds = [];  // Lista os IDs dos eventos de timeout que ainda irão acontecer.

        /**
         * Trata de comportamentos inadequados observados no plugin de validação:
         * - Mensagens de erros de validações assíncronas são visualizadas com outro padrão de formatação
         * - Mensagens de erros de validações assíncronas não são visíveis no sumário do formulário após sua submissão, se for o único erro apresentado no formulário
         */
        var handleAsyncMessages = function(field, result, msg, partOfBuckedCollection) {
            // Contêiner da mensagem de erro
            var errorWrapper =  $('.errorSummaryItem', element).find('[href=#'+$(field).attr('id')+']').parent();
            // Mensagem formatada de erro, seguindo os padrões de campos síncronos
            var formatedMsg;
            // Contador de erros na listagem ao topo do formulário
            var errorCount = 0;
            // Armazena o estado de validação do campo
            var valid;
            // Armazena os parâmetros customizados a serem incluídos nas mensagens de erro
            var feedbackParams;

            if (typeof result == "boolean") {
                valid = result;
            }
            else if (typeof result == "object") {
                if (typeof result.result == "boolean") {
                    valid = result.result;

                    if (result.params || result.params instanceof Array) {
                        feedbackParams = result.params;
                    }
                }
                else {
                    return true; // Não é o resultado correto, prossegue para a próxima regra
                }
            } else {
                return true; // Não é o resultado correto, prossegue para a próxima regra
            }

            formatedMsg = "<span class='errorSummaryLabel'>" + getLabel(field, element).text() + "</span>: " + "<span class='errorSummaryValue'>" + getFormattedString(msg, feedbackParams) + "</span>";

            // Checa se faz parte da verificação de todos os campos (Envio de formulário)
            if (!valid && partOfBuckedCollection) {
                // Se já possui erro, remove-o evitando duplicações
                if (errorWrapper.length > 0) {

                    $(errorWrapper.children()[0]).parent().remove();

                }
                formValidator.addSummaryListItem(field, formatedMsg, true);

            } else if (!valid && !partOfBuckedCollection) {
                /* Verifica se faz parte da verificação de campo (Quando o formulário não foi enviado ainda)
                    * Itera nos elementos de erro que referem-se ao campo atual, e remove os erros adicionados pela função do FFM
                    * handleAsynResult, que muitas vezes gera erros duplicados ou com formatação inadequada
                    */
                $(errorWrapper.children()).each(function(index){
                    // Checa se é uma mensagem de erro formatada inadequadamente e a remove

                    if ($(this).html() == getLabel(field, element).text() + " " +  getFormattedString(msg, feedbackParams)) {
                        $(this).parent().remove();

                        // Trata o contador de erros no formulário
                        errorCount = parseInt(element.find(".errorSummaryHeading .errorCount").text(), 10);
                        if (!isNaN(errorCount)) {
                            element.find(".errorSummaryHeading .errorCount").text(--errorCount);
                        }

                    }
                });

            }
        };
        // Evento on blur para todos elementos marcados com validação e também elementos que serão marcados dinâmicamente depois
        element.on("blur.validator", "[data-validate]:not(fieldset):not([data-no_inline_on_blur])", function(e, defaultBehavior) {

            // Insere um timeout antes do evento natural do plugin ser disparado
            if (!defaultBehavior) {
                e.stopImmediatePropagation();
                var timeoutId = setTimeout(function() {
                    timeoutIds.pop();
                    $(e.currentTarget).trigger('blur.validator', true);
                }, 150);
                timeoutIds.push(timeoutId);
            }
        });

        /*
         * Métodos públicos
         */

        this.destroy = function () {

            // Buscando uma combinação de métodos que funcionem como um 'destroy' do formValidator
            // continuar com o 'destroy' que não existe; ver métodos clear e removeValidationFromField
            // - Remove mensagens de erro que tenham sido exibidas
            formValidator.clear();
            // - Remove campos do processo de validação
            formValidator.removeValidationFromField(fieldsToValidate);
            // - Desliga os listeners registrados pelo FormValidator original
            element.off('.validator');

            // Para cada elemento que tenha a configuração 'validate'
            fieldsToValidate.each(function (i, field) {

                // Desfaz as alterações do DOM
                clearField($(field), fieldRules[i]);
            });
        };

        /**
         * Limpa a indicação de erros inserida durante o processo de validação do formulário.
         * Não remove erros inseridos manualmente com [markError]{@link module:Validation.markError}.
         *
         * @method reset
         * @instance
         */
        this.reset = function () {

            element.find('.errorSummaryContainer').remove();

            fieldsToValidate.each(function(index) {

                // Retorna se o campo tiver algum erro inserido manualmente
                // o desenvolvedor deve também realizar a remoção do erro manualmente
                if ($(this).attr("data-customerror")) return;

                var inputId = $(this).attr('id');

                $(this)
                    .removeClass("errorField")
                    .attr("aria-invalid", "false");

                $('#' + inputId + '-feedbackMsg')
                    .empty()
                    .removeClass('error')
                    .attr('aria-hidden', true);
            });

            $.each(timeoutIds, function(index, value) {
                clearTimeout(value);
                timeoutIds.shift();
            });
        };


        /**
         * Define uma regra personalizada para o validador.
         *
         * A função de callback passada como parâmetro tem estruturas diferentes para validação síncrona ou assíncrona.
         * - No caso de validação síncrona:
         *   - Recebe o parâmetro `value`, com o valor do campo a validar.
         *   - Deve retornar `false` para indicar que há erro.
         * - No caso de validação assíncrona:
         *   - Recebe os parâmetros `value` (valor do campo a validar) e `resultHandler`, um callback que deve ser chamado, recebendo como parâmetro `true`, se validou, ou `false`, se não validou.
         *   - O valor retornado é ignorado pelo Validation.
         *
         * @method setRule
         * @param ruleId {string} - Identificador (único) da regra, que será usado depois como valor de `validate`. O identificador deve ser composto de caracteres alfanuméricos. Se o identificador já existir, sobrescreverá o existente.
         * @param callback {function} - Função que implementa a regra, e será chamada para validar o valor.
         * @param msg {string} - Mensagem que deve ser mostrada para o usuário se o valor do campo validado estiver errado.
         * @param [async=false] {boolean} - Indica que a regra de validação é síncrona (false) ou assíncrona (true).
         * @instance
         */
        this.setRule = function (ruleId, callback, msg, async) {
            // Por padrão (se não informado), a validação não é assíncrona.
            async = async || false;

            var dataValidate,
                // Concatena o id da instância ao id da regra, para garantir que a regra afete apenas essa instância.
                // Isso é necessário porque a lista de regras de validação do plugin FFM é única, e não por instância.
                // É uma forma de simular, portanto, regras de instância, dando nomes diferentes a elas.
                instanceRuleId = ruleId + "." + instanceId;

            // Busca todos os elementos que possuem validação dentro do formulário
            // e concatena o instanceId caso corresponda a atual regra assíncrona
            fieldsToValidate.each(function(index) {
                dataValidate = $(this).data("validate");
                if (dataValidate.indexOf(ruleId) >= 0) {
                    dataValidate = replace(dataValidate, ruleId, instanceRuleId);
                    $(this).data("validate", dataValidate);
                    $(this).attr("data-validate", dataValidate);
                }
            });

            if (async) {
                setAsyncRule (instanceRuleId, callback, msg);
            }
            else {
                setRule (instanceRuleId, callback, msg);
            }
        };

        /**
         * Dispara o processo de validação do formulário (sem submetê-lo).
         *
         * Esse método não informa sobre o resultado do processo de validação.
         * Para obter informação sobre esse resultado, faça uso do evento `pic:validationCompleted`,
         * que é disparado ao fim do processo de validação.
         *
         * @method validate
         * @instance
         */
        this.validate = function() {
            formValidator.triggerBucketCollection();
        };

        /*
         * Métodos privados
         * São chamados apenas de dentro da classe: metodoPrivado()
         */
        var setRule = function (ruleId, callback, msg) {

            var ruleData = [];

            // @TODO Testar se callback está definido e é uma função. Caso contrário, abortar.
            // @TODO Testar se msg está definido. Caso contrário, abortar.
            ruleData[0] = callback;
            ruleData[1] = msg;

            formValidator.setRule(ruleId, ruleData);
        };

        var setAsyncRule = function (ruleId, ruleCallback, msg) {

            var ruleData = [];
            // @TODO Testar se ruleCallback está definido e é uma função. Caso contrário, abortar.
            // @TODO Testar se msg está definido. Caso contrário, abortar.

            // Cria a função que "envelopa" a função da regra definida pelo desenvolvedor
            // (ruleCallback), e essa função criada é que será usada pelo formValidator.
            // Como essa função retorna {async = true}, o formValidator trata
            // a regra como assíncrona, e espera que o método formValidator.handleAsyncResult()
            // seja chamado depois, quando a validação for concluída.
            // A chamada a esse método fica a cargo da função resultHandler(), que é criada
            // aqui também, dinamicamente.
            // Para que o desenvolvedor tenha acesso à função resultHandler(), ela é passada como
            // parâmetro para a função de callback que implementa a regra.
            // Esse esquema de callbacks entre Validation, formValidator e código do desenvolvedor
            // serviu essencialmente para esconder do desenvolvedor detalhes da implementação
            // do formValidator que não precisam estar expostos a ele.
            // O esquema abaixo mostra simplificadamente o fluxo de comunicação disparado
            // no momento em que o formValidator precisa validar um campo usando uma regra
            // de validação assíncrona. Nesse esquema, nem todos os parâmetros utilizados
            // nas chamadas são mostrados.
            /*
                +--------------------------+     +--------------------------------+     +------------------------------+     +-------------------------------------------+
                |  ## formValidator ##     |  +---> ## ruleCallbackWrapper ##     |  +---> ## ruleCallback ##          |  +---> ## resultHandler ##                      |
                |                          |  |  |                                |  |  |                              |  |  |                                           |
                |  Ao validar o campo,     |  |  |  Ao ser chamada, cria          |  |  |  Ao fim da validação,        |  |  |  Avisa ao formValidator                   |
                |  chama a função assos-   |  |  |  a função resultHandler,       |  |  |  chama a função que recebeu  |  |  |  que a validação foi                      |
                |  ciada à regra.          |  |  |  e chama a função,             |  |  |  como parâmetro:             |  |  |  concluída, passando o                    |
                |  No caso:                |  |  |  criada pelo desenvolvedor,    |  |  |                              |  |  |  resultado e os demais                    |
                |                          |  |  |  que fará a validação:         |  |  |  resultHandler(result) +--------+  |  parâmetros necessários.                  |
                |  ruleCallbackWrapper () +---+  |                                |  |  |                              |     |                                           |
                |                          |     |  ruleCallback (resultHandler) +---+  +------------------------------+     |  formValidator.handleAsyncResult(result)  |
                +--------------------------+     |                                |                                          |                                           |
                                                 +--------------------------------+                                          +-------------------------------------------+

            */
            var ruleCallbackWrapper = function (value, field, args, partOfBuckedCollection) {

                // Função que será chamada pela função que define a regra
                var resultHandler = function (result) {

                    // Função do FFM que trata o resultado de validações Assíncronas
                    // Concatena o instanceId para evitar interferência com outros formulários
                    formValidator.handleAsyncResult(ruleId, field, result, partOfBuckedCollection);
                    handleAsyncMessages(field, result, msg, partOfBuckedCollection);


                };

                // Executa a função de callback passando os parâmetros entregues pelo formValidator
                // Espera-se que essa execute algo de forma assíncrona, sem travar a execução.
                ruleCallback(value, resultHandler);

                // Toda regra que valida de forma assíncrona deve retornar isso.
                return {async: true};
            };

            // Usa não o ruleCallback diretamente, mas o ruleCallbackWrapper, que acionará o ruleCallback;
            ruleData[0] = ruleCallbackWrapper;
            ruleData[1] = msg;

            formValidator.setRule(ruleId, ruleData);
        };

        var removeError = function(field) {
            var fieldId = field.attr('id'),
                describedBy = fieldId + '-feedbackMsg';

            // Remove o elemento criado para conter a mensagem de erro;
            element.find('#'+describedBy).remove();

        };

        var destroyField = function(field, rules) {

            var fieldId = field.attr('id'),
                describedBy = fieldId + '-feedbackMsg';

            // Transforma string rules em array rules
            rules = rules ? rules.split(' ') : [];

            if (field.is('fieldset')) {

                // Remove classe 'required' (nem todos terão, mas tenta remover de todos)
                field.removeClass('required');

                // Para todos os elementos de formulário no fieldset
                // mesmo aqueles sem regras de validação diretamente associadas a elas,
                // remove o valor do atributo aria-describedby que corresponde à mensagem de
                // feedback desse fieldset.
                // Isso porque um fieldset marcado com regra de validação pode afetar o atributo
                // 'aria-describedby' de todos os campos que contém, mesmo que os campos individualmente
                // não possuam regras de validação.
                field.find('input, select, textarea, fieldset').attr('aria-describedby', function(i, attr) {
                    // Se o atributo estiver definido, faz a alteração necessária em seu valor.
                    // Se o atributo não estiver definido, retorna null.
                    return (attr ? attr.replace(describedBy, '').trim() : null);
                });

                field.removeUniqueId();
            }
            else {
                // @TODO verificar se não corre o risco de 'escapar' do escopo da instância
                // Remove class 'required' do form-group mais próximo
                field.closest('.form-group').removeClass('required');
            }

            // Remove todos os atributos 'data-errormsg-<nomedaregra>',
            $.each(rules, function (i, rule) {
                field.removeAttr('data-errormsg-' + rule);
            });

            // Como se está removendo a validação, não deve haver indicação se o campo é ou não inválido.
            // Também remove o atributo que indica se deve ou não haver validatção 'onBlur'
            field.removeAttr('aria-invalid data-no_inline_on_blur');
            // Remove o valor do atributo aria-describedby que corresponde à mensagem de
            // feedback do próprio campo.
            field.attr('aria-describedby', function(i, attr) {
                // Se o atributo estiver definido, faz a alteração necessária em seu valor.
                // Se o atributo não estiver definido, retorna null.
                return (attr ? attr.replace(describedBy, '').trim() : null);
            });
        };

        var clearField = function (field, rules) {

            // Remove a marcação de erro no campo
            removeError(field);

            // Remove as alterações feitas pelo PIC no campo
            destroyField(field, rules);
        };

        // Tudo o que deve ser executado se a validação falhar entra nessa função
        var validationCompletedHandler = function () {

            var invalids = [];

            // Dispara evento informando que não há campos inválidos
            element.trigger('pic:validationCompleted', [invalids]);

            // Se a validação foi disparada pelo usuário,
            // acionando um botão do formulário
            // ou pressionando enter, o que _nativamente_ o HTML trata como um acionamento de botão submit
            if (clickedButton !== null) {

                doSubmitByButton();
                // Embora depois da execução de doSubmitByButton não se espere que a página continue existindo,
                // já que o formulário será submetido efetivamente, por segurança voltamos o valor
                // de clickedButton ao original.
                clickedButton = null;
            }
        };

        // Tudo o que deve ser executado se a validação falhar entra nessa função
        var validationFailedHandler = function () {

            var invalids = formValidator.getInvalids();

            // Corrige mensagens de erro dos checkboxes
            invalids.each(fixCheckboxErrorMsg);
            // Dispara evento informando os campos inválidos
            element.trigger('pic:validationCompleted', [invalids]);
        };

        // Submete o form
        var doSubmitByButton = function ()  {

            createButtonProxy();
            // Efetiva a submissão do form (element)
            element.trigger('submit');
        };

        // Quando um botão de submissão é acionado, cria-se um input hidden
        // para representá-lo na submissão.
        // Isso equaliza o comportamento dos navegadores, pois Firefox e IE não estavam enviando
        // informações dos botões quando o form é submetido via javascript.
        var createButtonProxy = function () {
            var name = clickedButton.attr('name'),
                value = clickedButton.attr('value') || '', // Assume string vazio se não estiver definido
                buttonProxy;

            // Se o botão de submissão não possui valor de 'name', não deve mesmo ser repassado ao servidor.
            if (name) {

                buttonProxy = $('<input type="hidden" name="'+ name +'" value="'+ value +'">');
                element.append(buttonProxy);
                // Remove o valor do atributo 'name' do botão, para evitar duplicação de elementos com mesmo 'name'.
                clickedButton.attr('name', '');
            }
        };

        // Verifique se o campo é checkbox e faz os ajustes necessários nas mensagens de erro.
        var fixCheckboxErrorMsg = function () {

            var summaryItem,
                msg,
                label;

            if ($(this).is('[type=checkbox]')) {

                /*
                 * Correção da mensagem mostrada no sumário
                 */
                summaryItem = element.find('a[href="#' + $(this).attr('id') + '"]');

                // A mensagem que estava 'solta' no summaryItem é colocada no devido span
                msg = summaryItem.text();
                msg = '<span class="errorSummaryValue">' + msg + '</span>';

                // O label (texto que dá nome ao campo) é o texto do último nó dentro da tag 'label'.
                // Ele é obtido e colocado no devido span
                label = $(this).parent('label').contents().text().trim();
                label = '<span class="errorSummaryLabel">' + label + '</span>';

                // O summaryItem é refeito: esvaziado; preenchido com label, separador e msg
                summaryItem
                    .empty()
                    .append(label)
                    .append(FFM.validatorLocalizedStrings.pt_br.errorSeparator)
                    .append(msg);

            }
        };

        // Para todos os elementos validáveis, ativa/desativa a validação 'onblur'
        var setBlurValidation = function (validateOnBlur) {

            // Se é para validar, remove o atributo que impediria a validação.
            if (validateOnBlur) {
                fieldsToValidate.removeAttr('data-no_inline_on_blur');
            // Se não é para validar, coloca o atributo que impede a validação.
            } else {
                fieldsToValidate.attr('data-no_inline_on_blur', '');
            }
        };

        // Transforma os parâmetros vindos de 'data-pic-validation-config'
        // nos atributos data-* necessários para o formValidator
        var attributeTransform = function () {

            // O formValidator exige que um fieldset com regra associada possua o atributo id.
            fieldsToValidate.filter('fieldset').uniqueId();

            // Para cada elemento que tenha a configuração 'validate'
            fieldsToValidate.each(function () {

                var input,
                    config,
                    required = false,
                    requiredRule,
                    validate = '',
                    messages = {};

                input = $(this);

                // Prepara um valor para a eventual necessidade de validação da regra NOTBLANK_ALIAS
                // Se for um fieldset, será mantido NOTBLANK_ALIAS (é uma regra nossa);
                // Se não for, será 'notBlank' (regra embutida do formValidation)
                requiredRule = input.is('fieldset') ? NOTBLANK_ALIAS : 'notBlank';

                config = input.config(name);

                // Se config for um array de objetos {validate, msg}
                if ($.type(config) === 'array') {

                    // Para cada posição, ou seja, cada regra
                    $.each(config, function (index, rule) {

                        // Tradução de NOTBLANK_ALIAS
                        if (rule.validate === NOTBLANK_ALIAS) {
                            rule.validate = requiredRule;
                            required = true;
                        }

                        // Armazena cada regra separada por espaços em um string
                        validate += rule.validate + ' ';
                        // Armazena a mensagem associada à regra no objeto messages
                        // Se rule.msg não estiver definido, não há problema; a mensagem
                        // padrão da regra não será sobrescrita.
                        messages['data-errormsg-' + rule.validate.toLowerCase()] = rule.msg;
                    });

                } else {

                    // Se validate for um array de regras
                    // (Nesse caso, não é possível fornecer mensagens padronizadas)
                    if ($.type(config.validate) === 'array') {

                        // Tradução de NOTBLANK_ALIAS
                        $.each(config.validate, function (index, rule) {
                            if (rule === NOTBLANK_ALIAS) {
                                config.validate[index] = requiredRule;
                                required = true;
                            }
                        });

                        // Armazena cada regra separada por espaços em um string
                        validate = config.validate.join(' ');

                    // Se validate for uma única regra
                    } else {

                        // Tradução de NOTBLANK_ALIAS
                        if (config.validate === NOTBLANK_ALIAS) {
                            config.validate = requiredRule;
                            required = true;
                        }

                        // Armazena a regra em um string
                        validate = config.validate;
                        // Armazena a mensagem associada à regra no objeto messages
                        // Se rule.msg não estiver definido, não há problema; a mensagem
                        // padrão da regra não será sobrescrita.
                        messages['data-errormsg-' + config.validate.toLowerCase()] = config.msg;
                    }
                }

                // Nesse ponto, validate vai conter o(s) nome(s) da(s) regra(s) (separados por espaço)
                // e messagens será um objeto em que cada chave será nomeada como 'data-errormsg-<nomedaregra>',
                // e estará associada à mensagem de erro definida para a regra.
                input.attr('data-validate', validate);
                input.attr(messages);

                fieldRules.push(validate);

                // Se o campo for requerido (marcado com a regra NOTBLANK_ALIAS)
                if (required) {

                    // Se o campo for um fieldset
                    if (input.is('fieldset')) {
                        input.addClass('required');
                    }
                    // Se o campo não for um fieldset
                    else {
                        // Insere o atributo required do HTML5.
                        input.attr('required', '');
                        // Insere classe 'required' para permitir indicação visual do campo obrigatório.
                        input.closest('.form-group').addClass('required');
                    }
                }
            });
        };

        var submitButtonClick = function (e) {
            // Armazena o botão responsável pelo disparo
            clickedButton = $(this);
        };

        /*
         * Implementação do plugin
         */

        fieldsToValidate = element.find('input, select, textarea, fieldset').filterByConfig(name, 'validate');

        setBlurValidation(true);

        attributeTransform();

        // Obtém elementos que submetem o formulário (input ou button)
        submitButtons = element.find('input, button').filter(function () {
            // Dos controles mais genéricos selecionados pelo 'find',
            // mantém no conjunto apenas aqueles que o PIC considera como botão de submissão
            return PIC.isSubmitButton(this);
        });

        // Instancia o formValidator.
        if (submitButtons.length > 0) {
            // Trata o acionamento dos elementos que submetem o formulário.
            submitButtons.on('click'+eventNamespace, submitButtonClick);
            // Cria instância usando botões como trigger.
            formValidator = new FFM.FormValidator(element, submitButtons);
        }
        else {
            formValidator = new FFM.FormValidator(element);
        }

        // Indica a função a ser executada se a validação estiver sem erros.
        formValidator.setValidationCompletedHandler(validationCompletedHandler);
        // Indica a função a ser executada se a validação falhar.
        formValidator.setValidationFailedHandler(validationFailedHandler);
    };

    /*
     * Métodos estáticos (métodos de classe)
     */

    /**
     * Marca manualmente um erro em um campo específico.
     * Para remover o erro adicionado assim, use [clearError]{@link module:Validation.clearError}
     *
     * @method markError
     * @param field {mixed} - Campo de entrada ou fieldset que será marcado como contendo erro. Pode ser informado como um seletor, um elemento ou um objeto jQuery.
     * @param msg {string} - Mensagem de erro que deve ser associada ao campo.
     * @returns {boolean} Indica se marcou (true) ou não (false) o campo com erro.
     * @static
     */
    Validation.markError = function (field, msg) {
        var id,
            msgConteiner,
            elementToFollow;

        field = $(field);

        if (field.is('fieldset')) {
            // Se for um fieldset, garante que ele tenha um id.
            field.uniqueId();
        }

        id = field.attr('id');

        if (id && msg) {

            Validation.clearError(field);

            field.addClass("errorField");
            field.attr({
                "aria-invalid": "true",
                "aria-describedby": id + "-feedbackMsg",
                "data-customerror": "true"
            });

            msgConteiner = $('#' + id + '-feedbackMsg');

            if (!msgConteiner.length) {

                elementToFollow = FFM.customLogicForElementToFollow(field);

                if (!elementToFollow) {

                    elementToFollow = field;
                }

                elementToFollow.after('<span id="' + id + '-feedbackMsg" class="feedbackMsg" tabindex="-1">');
                msgConteiner = $('#' + id + '-feedbackMsg');
            }

            msgConteiner
                .empty()
                .html(FFM.validatorLocalizedStrings.pt_br.errorPrefix + msg)
                .addClass('error')
                .attr('aria-hidden', false);

            return true;
        }
        return false;
    };

    /**
     * Remove um erro marcado manualmente um erro em um campo específico.
     *
     * @method clearError
     * @param field {mixed} - Campo de entrada ou fieldset do qual o erro será removido. Pode ser informado como um seletor, um elemento ou um objeto jQuery.
     * @returns {boolean} Indica se desmarcou (true) ou não (false) o campo com erro.
     * @static
     */
    Validation.clearError = function (field) {
        var id;

        field = $(field);
        id = field.attr('id');

        // Não limpa o erro se não tiver sido inserido manualmente
        if (id && field.attr('data-customerror')) {

            field
                .removeClass("errorField")
                .removeAttr('data-customerror')
                .attr("aria-invalid", "false");

            $('#' + id + '-feedbackMsg')
                .empty()
                .removeClass('error')
                .attr('aria-hidden', true);

            return true;
        }
        return false;
    };

    /**
     * Define uma regra personalizada para o validador.
     * A diferença o método [`setRule()`]{@link module:Validation#setRule} de instância e esse (estático) é basicamente que uma regra definida por esse vale para todas as instâncias do Validation.
     *
     * A função de callback passada como parâmetro:
     *   - Recebe o parâmetro `value`, com o valor do campo a validar.
     *   - Deve retornar `false` para indicar que há erro.
     *
     * @method setRule
     * @param ruleId {string} - Identificador (único) da regra, que será usado depois como valor de `validate`. O identificador deve ser composto de caracteres alfanuméricos. Se o identificador já existir, sobrescreverá o existente.
     * @param callback {function} - Função que implementa a regra, e será chamada para validar o valor.
     * @param msg {string} - Mensagem que deve ser mostrada para o usuário se o valor do campo validado estiver errado.
     * @static
     */
    Validation.setRule = function (ruleId, callback, msg) {
        var rule = {};

        // Cria o objeto da regra conforme esperado pelo formValidator
        // onde o ruleId é a chave, e o array com callback e msg é o valor
        rule[ruleId] = [callback, msg];

        // Estende as regras de validação
        // Se a regra já existir antes, ela será sobrescrita.
        $.extend(true, FFM.defaultValidatorRules, rule);
    };

    Validation.prototype = {
        name: 'Validation'
    };

    /*
     * Solicita o registro do widget
     */
    PIC.widgetRegister(Validation);

})(jQuery, window, document);
})();
/* Início de novo arquivo concatenado */
(function () {/* Validation Mediator */
// Utilizado para fazer a conexão entre o widget Validation e os widgets que necessitam comunicar-se com ele

;(function ($, window, document, undefined) {
        'use strict';

        /*
         * Definição da classe
         */
        var ValidationMediator = function () {

            /*
             * Variáveis de instância
             * Defina todas aqui antes de usar
             */
            var eventNamespace = '.ValidationMediator';

            // Chama o método resetForm do validation para cada formulário dentro do elemento passado
            // Realizando as checagens necessárias
            var resetForm = function(element) {
                    $(element.find('form[data-pic-validation][data-pic-active]')).each(function () {
                        $(this).picValidation().reset();
                    });
            };

            var hasValidatedForm = function(element) {
                return element.find('form[data-pic-validation][data-pic-active]').length > 0;
            };

            // Registra uma callback para ser executada em caso de validação feita com sucesso
            // o parâmetro "once" true define que a callback será única e executada somente uma vez
            // Um caso de uso pode ser visto na chamada dentro do Modal.js
            var registerSuccessCallback = function(element, callback, once) {
                if(once) {
                    element.find('form[data-pic-validation][data-pic-active]').bind('pic:validationCompleted' + eventNamespace, function(e, invalids){
                        element.find('form[data-pic-validation][data-pic-active]').unbind('pic:validationCompleted' + eventNamespace);
                        if (invalids.length === 0) {
                            callback();
                        }
                    });
                } else {
                    element.find('form[data-pic-validation][data-pic-active]').on('pic:validationCompleted', function(e, invalids){
                        if (invalids.length === 0) {
                            callback();
                        }
                    });
                }
            };

            var registerFailCallback = function(element, callback, once) {
                if(once) {
                    element.find('form[data-pic-validation][data-pic-active]').bind('pic:validationCompleted' + eventNamespace, function(e, invalids){
                        element.find('form[data-pic-validation][data-pic-active]').unbind('pic:validationCompleted' + eventNamespace);
                        if (invalids.length > 0) {
                            callback();
                        }
                    });
                } else {
                    element.find('form[data-pic-validation][data-pic-active]').on('pic:validationCompleted', function(e, invalids){
                        if (invalids.length > 0) {
                            callback();
                        }
                    });
                }
            };

            // Força a validação do formulário validado dentro no elemento especificado
            var validate = function(element) {
                element.find('form[data-pic-validation][data-pic-active]').picValidation().validate();
            }

            this.validate = validate;
            this.registerSuccessCallback = registerSuccessCallback;
            this.registerFailCallback = registerFailCallback;
            this.hasValidatedForm = hasValidatedForm;
            this.resetForm = resetForm;
        };

        PIC.ValidationMediator = ValidationMediator;

    })(jQuery, window, document);
})();
/* Início de novo arquivo concatenado */
(function () {/* Modal */
/**
Transforma um bloco de conteúdo em uma janela modal.

Oferece recursos específicos para conteúdos específicos:
- [Mensagem de alerta (`alert`)](#dialog-alert)
- [Solicitação de confirmação (`confirm`)](#dialog-confirm)
- [Formulário (`form`)](#dialog-form)
- [Padrão (`default`)](#dialog-default) - caso o conteúdo não se enquadre em nenhum dos anteriores


#### Parâmetros comuns

Esses são os parâmetros comuns a todos os diálogos possíveis.
A documentação dos parâmetros específicos para cada diálogo encontra-se na seção correspondente.
<table class="params">
    <thead>
        <tr>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Atributos</th>
            <th>Default</th>
            <th class="last">Descrição</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td class="name">title</td>
            <td class="type">string</td>
            <td class="atrributes">&lt;optional&gt;</td>
            <td class="default">"Mensagem da página"</td>
            <td class="description last">Título da janela modal. Apesar de opcional, é <em>altamente recomendado</em> que a modal tenha um título específico.</td>
        </tr>
        <tr>
            <td class="name">dialog</td>
            <td class="type">string</td>
            <td class="atrributes">&lt;optional&gt;</td>
            <td class="default">"default"</td>
            <td class="description last">Define o diálogo desejado. Valores possíveis: default|confirm|alert|form.</td>
        </tr>
    </tbody>
</table>



<div id="dialog-alert" class="custom-section"></div>
#### Modal de alerta (`dialog=alert`)

Use `dialog=alert` para fornecer ao usuário um alerta curto, sobre o qual ele não tenha que tomar nenhuma decisão.

A modal deve conter a mensagem de alerta.

##### Parâmetros específicos

<table class="params">
    <thead>
        <tr>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Atributos</th>
            <th>Default</th>
            <th class="last">Descrição</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td class="name">type</td>
            <td class="type">string</td>
            <td class="atrributes">&lt;optional&gt;</td>
            <td class="default">"default"</td>
            <td class="description last">Define o tipo de modal desejado. Valores possíveis: default|info|success|warning|error</td>
        </tr>
    <tbody>
</table>



<div id="dialog-confirm" class="custom-section"></div>
#### Modal de confirmação (`dialog=confirm`)

Use `dialog=confirm` para solicitar ao usuário a confirmação de alguma ação.

A modal deve conter a mensagem de confirmação.

A modal possui sempre dois botões, o primeiro associado à _resposta positiva_, e o segundo à _resposta negativa_ dada pelo usuário.

Pode ser utilizado para executar uma ação (função) especificada.

Pode ser utilizado para confirmar a submissão de um formulário, _quando o formulário não está dentro da modal_.
Se o formulário está dentro da modal, use `dialog=form`.

Ordem de execução ao clicar no botão de confirmação:
1. A modal dispara o evento `pic:confirm`. Se houver um listener para esse evento que retorne `false`, a execução é interrompida.
2. Se o parâmetro `callback` (que recebe uma função) tiver sido informado, essa função é executada. Se o retorno dessa função for `false`, a execução é interrompida.
3. Se o parâmetro `formId` tiver sido informado, o formulário correspondente é submetido.
4. A modal é ocultada (veja evento `pic:hide` para mais detalhes).

Veja mais informações sobre o comportamento dessa modal na documentação do evento `pic:confirm`.


##### Parâmetros específicos
<table class="params">
    <thead>
        <tr>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Atributos</th>
            <th>Default</th>
            <th class="last">Descrição</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td class="name">type</td>
            <td class="type">string</td>
            <td class="atrributes">&lt;optional&gt;</td>
            <td class="default">"default"</td>
            <td class="description last">Define o tipo de modal desejado. Valores possíveis: default|warning</td>
        </tr>
        <tr>
            <td class="name">size</td>
            <td class="type">string</td>
            <td class="atrributes">&lt;optional&gt;</td>
            <td class="default">"sm"</td>
            <td class="description last">Define a largura da modal desejada. Valores possíveis: sm|md|lg</td>
        </tr>
        <tr>
            <td class="name">labels</td>
            <td class="type">array</td>
            <td class="atrributes">&lt;optional&gt;</td>
            <td class="default">["Sim", "Não"]</td>
            <td class="description last">Define os rótulos dos botões da modal. Se for informado um string ou um array de apenas uma posição, o rótulo será aplicado ao primeiro botão.</td>
        </tr>
        <tr>
            <td class="name">[callback.name]</td>
            <td class="type">string</td>
            <td class="atrributes">&lt;optional&gt;</td>
            <td class="default"></td>
            <td class="description last">Nome da função javascript que será executada ao confirmar.</td>
        </tr>
        <tr>
            <td class="name">[callback.params]</td>
            <td class="type">string</td>
            <td class="atrributes">&lt;optional&gt;</td>
            <td class="default"></td>
            <td class="description last">Parâmetro da função javascript que será executada ao confirmar. Se houver mais de um parâmetro, informe cada um como elemento de um array, como: [1, 2, 3].</td>
        </tr>
        <tr>
            <td class="name">formId</td>
            <td class="type">string</td>
            <td class="atrributes">&lt;optional&gt;</td>
            <td class="default"></td>
            <td class="description last">Atributo `id` do formulário que será submetido ao confirmar.</td>
        </tr>
    <tbody>
</table>



<div id="dialog-form" class="custom-section"></div>
#### Modal de formulário (`dialog=form`)

Use `dialog=form` para uma modal que contenha um formulário e que sirva para fazer a submissão dele.

Para esse diálogo, essa estrutura HTML é obrigatória:
- a tag `form` deve ser o último elemento dentro da modal;
- o botão (ou os botões, se for o caso) do formulário deve estar dentro de um `div` com a classe `buttons`, que deve ser o último elemento dentro de `form`.

__Exemplo da estrutura para um formulário dentro da modal__
```html
<div data-pic-modal='{"title": "Inclusão de pessoa", "dialog": "form"}' id="meuModalForm">
    <p>Informe os dados da pessoa física.</p>
    <!-- Última tag filha da div data-pic-modal -->
    <form id="meuForm">
        <div class="form-group">
            <label for="nome">Nome</label>
            <input id="nome" name="nome" type="text" class="form-control" />
        </div>
        <!-- Última tag filha de form -->
        <div class="buttons">
            <button type="submit">Salvar</button>
        </div>
    </form>
</div>
```

O botão "Fechar" é gerado pelo widget, e por isso não deve ser criado no HMTL.

Essa modal trabalha de forma integrada com o formulário contido nela e com o [Validation]{@link module:Validation}, se estiver sendo usado:
- Evita que usuário perca seu trabalho, ao confirmar o fechamento quando o formulário tiver sido alterado.
- Reinicia (reset) os dados do formulário quando a modal é fechada.
- Limpa os erros de validação quando a modal é fechada.
- Impede ações do usuário enquanto algum processamento em segundo plano estiver sendo executado.

Para essa modal, o método [`hide()`]{@link module:Modal#hide} funciona como para qualquer outro diálogo,
apenas ocultando a modal, sem interferir em seu conteúdo.

Diferentemente, o método [`cancel()`]{@link module:Modal#cancel} possui controles associados a ele.
Assim, para encerrar esse diálogo programaticamente (ou seja, sem ação direta do usuário)
e sem a submissão do formulário (ou seja, cancelá-lo), esse método deve ser utilizado.


##### O que usar: `submit` ou `button`?

Para submeter o formulário usando o modelo request/response, o mais prático é utilizar um [botão que submete o formulário](http://sptdes/wiki/Bot%C3%B5es_que_submetem_um_formul%C3%A1rio_HTML). Dessa forma, não há necessidade de scripts adicionais para o funcionamento do formulário dentro da modal.

Para submeter o formulário via Ajax, ou fazer qualquer tipo de processamento client-side em segundo plano,
deve-se usar um botão que não provoque a submissão do formulário.
Nesse caso, a modal transfere parte da responsabilidade de seu funcionamento para o desenvolvedor.
Veja o método [`done()`]{@link module:Modal#done};

Para mais detalhes sobre como utilizar `dialog=form`, acesse o {@tutorial modal-exemplos}.


<div id="dialog-default" class="custom-section"></div>
#### Modal padrão (`dialog=default`)

Use `dialog=default` para criar uma modal com conteúdo genérico, que não se enquadre em nenhum dos diálogso mais específicos.

Por padrão, essa modal possui um único botão "Fechar". O rótulo desse botão pode ser alterado via parâmetro. Para modificar totalmente a área de botões, utilize a classe `buttons` como explicado a seguir.

##### Uso da classe `buttons`

Para personalizar os botões, coloque os botões desejados (um ou mais) em um `div` com a classe `.buttons`, no conteúdo da modal. Eles substituirão o botão original. Por padrão, o acionamento de qualquer um desses botões fecha a modal. Aplique a configuração interna `noclose` para cada botão que precisar manter a modal aberta quando acionado.

##### Parâmetros específicos
<table class="params">
    <thead>
        <tr>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Atributos</th>
            <th>Default</th>
            <th class="last">Descrição</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td class="name">labels</td>
            <td class="type">string</td>
            <td class="atrributes">&lt;optional&gt;</td>
            <td class="default">"Fechar"</td>
            <td class="description last">Define o rótulo do único botão da modal, responsável por fechá-la.</td>
        </tr>
    <tbody>
</table>


@complement Configuração_interna

- `noclose`:
  Se forem criados botões personalizados (com `dialog=default`), determina que o botão com essa configuração não feche automaticamente a modal.

@module Modal
@attribute data-pic-modal
@fires pic:confirm
@fires pic:shown
@fires pic:hidden
@fires pic:show
@fires pic:hide

@example <caption>Código HTML básico para o disparador da modal e para a modal em si</caption>
<!-- O botão que dispara (abre) a modal. Atente para o atributo data-target -->
<button data-toggle="modal" data-target="#meuModal">Mostrar</button>

<!-- a modal em si -->
<div data-pic-modal='{"title": "Exemplo de modal"}' id="meuModal">
    <p>Conteúdo da modal</p>
</div>


@example <caption>Modal com botões personalizados</caption>
<div data-pic-modal='{"title": "Exemplo de modal com meus botões"}' id="meuModalBotoes">
    <p>Conteúdo da modal</p>
    <div class="buttons">
        <button data-pic-modal-config='noclose'>Confirmar</button>
    </div>
</div>

*/

/**
 * Esse evento é útil para controlar as ações do usuário sobre a modal do tipo `confirm`.
 *
 * O handler associado a esse evento saberá quando um dos botões da modal for acionado.
 * Se o handler retornar o valor `false`, o fechamento da modal será cancelado, ou seja,
 * ele permanecerá aberto. Caso contrário, terá o comportamento padrão.
 *
 * @event pic:confirm
 * @param {boolean} result - Terá o valor `true` se o usuário acionou o botão de confirmação
 *        da modal. Se acionou o botão de cancelamento, valerá `false`.
 *
 */

/**
 * Esse evento é util para realizar qualquer ação necessária assim que a modal é exibida.
 *
 * Disparado logo após a exibição da modal.
 *
 * @event pic:shown
 *
 */

/**
 * Esse evento é util para realizar qualquer ação necessária assim que a modal é ocultada.
 *
 * Disparado logo após a ocultação da modal.
 *
 * @event pic:hidden
 *
 */

/**
 * Esse evento é util para realizar qualquer ação necessária quando a modal está prestes a ser exibida.
 *
 * Disparado antes da exibição da modal.
 *
 * A exibição da modal pode ser evitada usando o handler do evento para retornar `false` ou fazer `preventDefault()`
 *
 * @event pic:show
 *
 */

/**
 * Esse evento é util para realizar qualquer ação necessária quando a modal está prestes a ser ocultada.
 *
 * Disparado antes da ocultação da modal.
 *
 * A ocultação da modal pode ser evitada usando o handler do evento para retornar `false` ou fazer `preventDefault()`
 *
 * @event pic:hide
 *
 */

;(function ($, window, document, undefined) {

    'use strict';

    /*
     * Variáveis globais
     * no escopo da closure
     */
    var ValidationMediator = new PIC.ValidationMediator();
    var busyMark = "<div class='maskLoaderPic maskAbsolute invert'><div class='loaderPic spinMed'></div></div>";

    /*
     * Definição da classe
     */
    var Modal = function (widgetHelper) {

        // Armazena instância da Modal com o tipo especificado
        var modal;

        // Instancia e define o prototype da modal especificada
        switch(widgetHelper.options.dialog) {
            case "form":
                FormModal.prototype = new BaseModal(widgetHelper, this.name);
                modal = new FormModal();
                // Tornando públicos os métodos próprios deste tipo de modal
                this.cancel = modal.cancel;
                this.done = modal.done;
                break;
            case "confirm":
                ConfirmModal.prototype = new BaseModal(widgetHelper, this.name);
                modal = new ConfirmModal();
                break;
            case "alert":
                AlertModal.prototype = new BaseModal(widgetHelper, this.name);
                modal = new AlertModal();
                break;
            case "default":
                DefaultModal.prototype = new BaseModal(widgetHelper, this.name);
                modal = new DefaultModal();
                break;
        }

        // Inicia a Modal
        modal.init();

        // Torna visível os seguintes métodos
        this.show = modal.show;
        this.hide = modal.hide;
        this.toggle = modal.toggle;
        this.destroy = modal.destroy;

    };

    var BaseModal = function(widgetHelper, name) {

        /*
         * Variáveis de instância
         * Defina todas aqui antes de usar
         */
        var self = this,
            options = widgetHelper.options,
            eventNamespace = widgetHelper.eventNamespace,
            element = widgetHelper.element,
            visible = false,
            transitioning = false,
            lastFocused,
            originalStyle,
            busyStatus = false,
            typeMap = {
            'default': '',
            'info':    'info',
            'success': 'sucesso',
            'warning': 'advertencia',
            'error':   'erro'
            },
            preventTab = function(e) {
                var keyCode = e.keyCode || e.which;
                if (keyCode == 9) {
                    e.preventDefault();
                }
            };

        // Constrói os elementos comuns da modal
        var buildModalElement = function() {
            // Armazena o conteúdo original do atributo style (ou um string vazio se não estiver definido)
            originalStyle = element.attr('style') || '';

            // Classes
            element.addClass("modal fade");

            // Atributos
            element.attr({
                "role":             "dialog",
                "tabindex":         "-1",
                "aria-hidden":      "true",
                "aria-modal":       "true",
                "data-keyboard":    "true",
            });

            // Armazena aqui tudo o que está contido no element, e remove do DOM
            var modalContent = element.children().detach();

            // Define que classe(s) a modal deve possuir, conforme o diálogo e o tipo.
            // modalClass = defineModalClass(options.dialog, options.type, options.size);
            element.append('<div class="modal-dialog"></div>');

            // Cria área de conteúdo (cabeçalho, corpo, rodapé)
            element.find('.modal-dialog').append('<div class="modal-content"></div>');
            // Cria área para cabeçalho
            element.find('.modal-content').append('<div class="modal-header"></div>');

            element.find('.modal-header').append('<button type="button" class="close" data-dismiss="modal" aria-label="Fechar"><span aria-hidden="true">&times;</span></button>');

            // Insere título, fazendo com que ele seja o rótulo da modal (via aria-labelledby)
            element.find('.modal-header').append('<h4 class="modal-title">' + options.title + '</h4>');
            var titleId = element.find('.modal-title').uniqueId().attr('id');
            element.attr('aria-labelledby', titleId);
            // Cria área do corpo
            element.find('.modal-content').append('<div class="modal-body"></div>');
            // Reinsere o conteúdo original no corpo
            element.find('.modal-body').append(modalContent);

        };

        // Registra os eventos comuns da modal
        var registerEvents = function() {
            // Eventos

            // Dispara o evento pic:show quando a Modal está prestes a abrir
            element.on('show.bs.modal' + eventNamespace, function (e) {

                var picShowEvent;

                if (visible || transitioning) {
                        console.warn(name, ': Evento show da modal não produziu efeito. \n' +
                        'Para uma mesma modal, não é possível acionar o evento show enquanto esta estiver em transição ou aberta \n' +
                        'Visível: ', visible + '\n' +
                        'Transição: ', transitioning + '\n' +
                        'Elemento: ', element
                    );
                    // Interrompe o processo de exibição da modal.
                    e.preventDefault();
                    return;
                }

                // Gera e dispara o evento pic:show
                picShowEvent = $.Event('pic:show');
                element.trigger(picShowEvent);

                // Se pic:show tiver sido "prevenido".
                if (picShowEvent.isDefaultPrevented()) {
                    // Interrompe o processo de exibição da modal.
                    e.preventDefault();
                    return;
                }

                transitioning = true;

                // Armazena o elemento que estava com foco exatamente antes de a modal ser aberta.
                // Dá preferência ao que vem de relatedTarget (setado pelo Bootstrap quando é aberta por meio de um clique).                
                lastFocused = $(e.relatedTarget) || $(document.activeElement);

                //Configura altura do corpo de conteúdo da modal de acordo com a resolução de tela do usuário
                element.find('.modal-body').css('overflow-y', 'auto');
                // element.find('.modal-body').css('max-height', $(window).height()/100 * 70);
            });

            // Dispara o evento pic:hide quando a Modal está prestes a fechar
            element.on('hide.bs.modal' + eventNamespace, function (e) {

                var picHideEvent;

                if (!visible || transitioning) {
                    console.warn(name, ': Evento hide da modal não produziu efeito. \n' +
                        'Para uma mesma modal, não é possível acionar o evento hide enquanto esta estiver em estado de transição ou escondida \n' +
                        'Visível: ', visible + '\n' +
                        'Transição: ', transitioning + '\n' +
                        'Elemento: ', element
                    );
                    // Interrompe o processo de ocultação da modal.
                    e.preventDefault();
                    return;
                }

                // Gera e dispara o evento pic:hide
                picHideEvent = $.Event('pic:hide');
                element.trigger(picHideEvent);

                // Se pic:hide tiver sido "prevenido".
                if (picHideEvent.isDefaultPrevented()) {
                    // Interrompe o processo de ocultação da modal.
                    e.preventDefault();
                    return;
                }

                visible = false;
                transitioning = true;

            });

            element.on('shown.bs.modal' + eventNamespace, function (e) {
                element.triggerHandler('pic:shown');

                visible = true;
                transitioning = false;

                // Alterna os valores do atributo aria-hidden quando a visibilidade da modal é alterada
                element.attr('aria-hidden', 'false');
            });

            element.on('hidden.bs.modal' + eventNamespace, function () {
                element.triggerHandler('pic:hidden');

                transitioning = false;

                if (lastFocused) {
                    // Se a modal tiver sido aberta a partir de uma opção do Actionsbar
                    if (lastFocused.closest("ul") && lastFocused.closest("ul").is("[data-pic-actionsbar]")) {
                        // Leva o foco não para a opção em si, mas para o acionador.
                        lastFocused.closest("ul").prev().focus();
                    }
                    else {
                        lastFocused.focus();
                    }
                    lastFocused = undefined;
                }

                // Alterna os valores do atributo aria-hidden quando a visibilidade da modal é alterada
                element.attr('aria-hidden', 'true');
            });

        };

        /**
         * Mostra a modal.
         *
         * Se ela estiver visível, ou em transição, não tem efeito.
         *
         * @method show
         * @instance
         */
        var show = function () {
            element.modal('show');
        };

        /**
         * Esconde a modal.
         *
         * Se ela estiver oculta, ou em transição, não tem efeito.
         *
         * @method hide
         * @instance
         */
        var hide = function () {
            element.modal('hide');
        };

        /**
         * Alterna a visibilidade da modal (mostra ou esconde)
         *
         * Se ela estiver em transição (animação entre visível e oculta), não tem efeito.
         *
         * @method toggle
         * @instance
         */
        var toggle = function () {
            if (visible === true) {
                hide();
            } else {
                show();
            }
        };

        var busy = function () {

            busyStatus = true;

            // Mostrando para leitores de tela, o estado ocupado da modal
            element.find(".modal-content").append("<label style='display:none;' aria-live='polite'>Carregando</label>");

            // Mostra visualmente um loader
            element.find(".modal-content").prepend(busyMark);

            // Evita que o pressionamento de "tab" altere o foco enquanto a modal estiver ocupada
            $(document).on('keydown' + eventNamespace, preventTab);

            // Previne o fechamento da modal por ações do usuário
            element.data("bs.modal").options.backdrop = "static";
            element.data("bs.modal").options.keyboard = false;
            element.off('keydown.dismiss.bs.modal');
        };

        var idle = function () {

            if (!busyStatus) {
                throw "O método done só pode ser executado se a modal estiver previamente em estado de ocupado";
                return;
            }

            busyStatus = false;

            // Remove o loader
            element.find(".maskLoaderPic").remove();

            // Tratamento da navegação utilizando Tab
            $(document).off('keydown' + eventNamespace, preventTab);


            // Retorna o comportamento padrão da modal
            element.data("bs.modal").options.backdrop = true;
            element.data("bs.modal").options.keyboard = true;
            element.data("bs.modal").escape();
        };

        // GETS & SETS

        var setVisible = function(value) {
            visible = value;
        };

        var setTransitioning = function(value) {
            transitioning = value;
        };

        var getVisible = function() {
            return visible;
        };

        var getTransitioning = function() {
            return transitioning;
        };

        // Destrói os elementos comuns da modal
        var destroyBase = function() {

            var customButtonsWrapper,
                modalContent;

            widgetHelper.clearEvents();

            self.hide();
            // Localiza botões que tenham sido criados dinamicamente.
            customButtonsWrapper = element.find('.modal-footer.buttons');

            if (customButtonsWrapper.length) {
                // Remove classes e atributos dos botões
                customButtonsWrapper.children('button')
                    .removeClass('btn btn-default')
                    .removeAttr('data-dismiss');
                // Remove classe do wrapper e o remove do DOM
                customButtonsWrapper
                    .removeClass('modal-footer')
                    .detach();

            }

            // Armazena o conteúdo do corpo da modal
            modalContent = element.find('.modal-body').children().detach();
            // Remove toda a estrutura que foi criado dinamicamente para a modal
            element.find('.modal-dialog').remove();
            // Devolve para o DOM o conteúdo que havia se tornado o corpo da modal
            element.append(modalContent);

            element.removeAttr('role tabindex aria-hidden aria-modal data-keyboard aria-labelledby');
            element.removeClass('modal fade');

            // Devolve o valor original de style
            element.attr('style', self.originalStyle);
        };

        // Expõe variáveis da instância
        self.name               = name;
        self.options            = options;
        self.eventNamespace     = eventNamespace;
        self.element            = element;
        self.lastFocused        = lastFocused;
        self.originalStyle      = originalStyle;
        self.typeMap            = typeMap;
        self.buildModalElement  = buildModalElement;
        self.registerEvents     = registerEvents;
        self.show               = show;
        self.hide               = hide;
        self.toggle             = toggle;
        self.busy               = busy;
        self.idle               = idle;
        self.destroyBase        = destroyBase;
        self.visible            = visible;
        self.transitioning      = transitioning;
        self.setVisible         = setVisible;
        self.setTransitioning   = setTransitioning;
        self.getVisible         = getVisible;
        self.getTransitioning   = getTransitioning;
        // Define o método destrói padrão caso não seja definido para o tipo de modal específico
        self.destroy            = destroyBase;

    };

    var FormModal = function() {

        var self = this,
            busy = self.busy,
            idle = self.idle,
            waitingUserInput = false,
            hideIntercepted = false,
            hide = self.hide,
            itemFocus, // Guarda o último item focado antes de esconder a modal
            confirmModal, // Armazena o elemento confirm modal no DOM
            confirmModalElement =  $('<div data-backdrop="false"><p>As alterações feitas no formulário serão perdidas.</p></div>'),
            confirmModalBackdrop,
            closeButton,
            alert, // Armazena o elemento alert no DOM
            alertHtml = '<p data-pic-alert=\'{"type": "error"}\'></p>',
            ASYNC = "ASYNC",
            DEFAULT = "DEFAULT",
            buttonType = DEFAULT,
            formInitialState = self.element.find('form').serialize(); // Estado inicial do formulário

        // Iniciação de modal do tipo form
        var init = function() {

            // Fazendo checagens para o tipo de modal form
            // Checa se o elemento form é o úlimo filho da modal e se este possui a uma div com a classe .buttons
            // Se não, a criação do widget é abortada e uma mensagem de erro é disparada
            if ( !$(":last-child", self.element).is("form") || !$(":last-child", self.element).find(":last-child").hasClass("buttons") ) {
                console.warn(self.name, ': O DOM da modal não pode ser iniciado corretamente. \n' +
                                   ' Modal do tipo form deve conter um elemento form como último filho e uma div com a classe .buttons como último filho do form \n' +
                                   'Elemento: ', self.element);
                return;
            };

            buildModalElement();
            createButtons();
            defineClass();
            registerEvents();
        };

        /**
         * _Disponível apenas para `dialog=form`_
         *
         * Deve ser utilizado para cancelar o diálogo do formulário. O cancelamento consiste em:
         * - a ocultação da modal
         * - o reset do formulário (restauração de seus valores iniciais)
         * - a remoção de mensagens de erros de validação geradas pelo Validation (se for o caso)
         *
         * Se algum campo do formulário tiver sido alterado desde o momento em que a modal foi mostrada, o usuário precisará confirmar o cancelamento. Somente com essa confirmação o cancelamento será realizado.
         *
         * Se for preciso cancelar o diálogo incondicionalmente, pode-se usar o parâmetro `force=true`
         *
         * @method cancel
         * @param [force=false] {boolean} - quando setado (true), faz com que o diálogo seja cancelado incondicionalmente, sem solicitar confirmação ao usuário.
         * @instance
         */
        var cancel = function(force) {

            if (waitingUserInput) {
                return console.warn(name, ': Evento cancel da modal não produziu efeito. \n' +
                'Não é possível acionar o evento cancel enquanto espera-se por uma ação do usuário \n' +
                'Elemento: ', self.element
                );
            }

           if (force) {
                finish();
                hide();
           } else {
                hide();
           }
        };

        // Mostra a modal de confirmação, neste caso a Modal já está sendo escondida
        // ao contrário do método cancel que também esconde a modal
        var requestCancel = function() {
            if (confirmModal) {
                confirmModal.modal('show');
            }
        };

        // Reseta o formulário, foco e elementos de validação
        var finish = function() {
            itemFocus = null;

            if(alert) {
                alert.remove();
            }

            ValidationMediator.resetForm(self.element);

            $(self.element.find('form')).each(function(){
                this.reset();
            });
        };

        var buildModalElement = function() {
            self.buildModalElement();

            // Cria wrapper em volta da modal para colocar a modal de confirmação
            self.element.wrap('<div class="modal-form-wrapper"></div>');

            // Coloca a modal de confirmação no DOM, sem exibi-la
            confirmModal = confirmModalElement
                                .appendTo(self.element.parent())
                                .uniqueId();

            PIC.activateWidget("Modal", self.element.parent().find(confirmModal), {
                "dialog": "confirm",
                "type":   "warning",
                "labels": ["Descartar", "Retornar ao formulário"],
                "title":  "Descartar alterações?"
            }, true);

            $(confirmModal).on('pic:confirm' + self.eventNamespace, function (e, result) {
                waitingUserInput = false;
                if (!result) {
                    if (itemFocus) {
                        setTimeout(function() {
                            itemFocus.focus();
                        }, 0);
                    }
                } else {
                    cancel(true);
                }
            });

            // Adiciona o backdrop manualmente
            $(confirmModal).on('show.bs.modal' + self.eventNamespace, function(e) {
                if (confirmModal.css('display') === 'none') {
                    var backdrops = $('.modal-backdrop');
                    var zIndex = 1040 + (20 * backdrops.length);
                    confirmModal.css('z-index', zIndex);
                    confirmModalBackdrop = $('<div style="z-index: '+ (zIndex - 1) +';" class="modal-backdrop fade in"></div>')
                                                                                    .appendTo(document.body)
                                                                                    .uniqueId();
                }
            });

            // Fecha a modal caso o usuário clique fora
             $(confirmModal).on('click' + self.eventNamespace, function(e) {
                if ($(e.target).is(confirmModal)) {
                    confirmModal.picModal().hide();
                }
            });

            $(confirmModal).on('shown.bs.modal' + self.eventNamespace, function(e) {
                waitingUserInput = true;
            });

            // Retira o backdrop da confirmModal
            $(confirmModal).on('hidden.bs.modal' + self.eventNamespace, function(e) {
                confirmModalBackdrop.remove();
                $('body').addClass('modal-open');
            });

        };

        // Registra os eventos da modal
        var registerEvents = function() {

            var buttons;

            self.registerEvents();

            // Pega todos os button e input dentro da div.buttons (exceto o último, que é o botão "Fechar" criado pelo widget)
            buttons = self.element.find('.buttons button, .buttons input');
            buttons = buttons.not(closeButton);

            // Evento acionado no click de botões da modal
            buttons.on('click' + self.eventNamespace, function(e){
                self.busy();
                buttonType = PIC.isSubmitButton(e.currentTarget) ? DEFAULT : ASYNC;
            });

            if (ValidationMediator.hasValidatedForm(self.element)) {
                ValidationMediator.registerFailCallback(self.element, function(){
                    setTimeout(function(){
                        if (buttonType === DEFAULT) {
                            self.idle();
                        }
                    }, 0);
                });
            }

            self.element.on('shown.bs.modal' + self.eventNamespace, function(){
                self.element.find('.modal-body').find('form').find(':tabbable').first().focus();
                hideIntercepted = false;
            });

            self.element.off('hide.bs.modal' + self.eventNamespace).on('hide.bs.modal' + self.eventNamespace, function(e){

                var picHideEvent;

                if (!self.getVisible() || self.getTransitioning()) {
                    console.warn(name, ': Evento hide da modal não produziu efeito. \n' +
                        'Para uma mesma modal, não é possível acionar o evento hide enquanto esta estiver em estado de transição ou escondida \n' +
                        'Visível: ', self.getVisible() + '\n' +
                        'Transição: ', self.getTransitioning() + '\n' +
                        'Elemento: ', self.element
                    );
                    // Interrompe o processo de ocultação da modal.
                    e.preventDefault();
                    return;
                }

                if (self.element.find('form').serialize() !== formInitialState && !hideIntercepted) {
                    requestCancel();
                    return e.preventDefault();
                }


                // Gera e dispara o evento pic:hide
                picHideEvent = $.Event('pic:hide');
                self.element.trigger(picHideEvent);

                // Se pic:hide tiver sido "prevenido".
                if (picHideEvent.isDefaultPrevented()) {
                    // Interrompe o processo de ocultação da modal.
                    e.preventDefault();
                    return;
                }

                self.setVisible(false);
                self.setTransitioning(true);

                // Armazena o elemento que estava com foco exatamente antes de a modal ser aberta
                itemFocus = document.activeElement;

            });

            self.element.on('hidden.bs.modal' + self.eventNamespace, function(){
                if (!hideIntercepted) {
                    finish();
                }
            });

        };

        // Cria os botões para modal do tipo form
        var createButtons = function() {
            // Adiciona a classe interna "pic-modal-footer" que emula o comportamento da classe do bootstrap "modal-footer"
            // mas sem alterar o comportamento do formulário
            self.element.find('.buttons').addClass('pic-modal-footer');
            // Adiciona o botão fechar logo após os botões definidos pelo desenvolvedor
            closeButton = $('<button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>')
                                .appendTo(self.element.find('.pic-modal-footer'));
        };

        // Define classe para modal do tipo form
        var defineClass = function() {
            self.element.find(".modal-dialog").addClass("modal-lg");
        };

        // Destrói o elemento para modal do tipo form
        // Este método deve chamar o método genérico "destroyBase" que destrói elementos comuns para os tipos de modal
        var destroy = function() {
            // Removendo botão fechar
            if (closeButton) {
                closeButton.remove();
            }
            // Removendo modal auxiliar de confirmação
            if (confirmModal) {
                PIC.destroyWidget('Modal', confirmModal, true);
                confirmModal.remove();
                confirmModal = undefined;
            }
            // Removendo backdrop da modal auxiliar de confirmação
            if (confirmModalBackdrop) {
                confirmModalBackdrop.remove();
                confirmModalBackdrop = undefined;
            }
            // Removendo wrapper
            self.element.unwrap('.modal-form-wrapper');

            self.destroyBase();
        };

        // Esconde (fecha) a modal
        var hideInterceptor = function () {

            if (waitingUserInput) {
                return console.warn(name, ': Evento hide da modal não produziu efeito. \n' +
                'Não é possível acionar o evento hide enquanto espera-se por uma ação do usuário \n' +
                'Elemento: ', self.element
                );
            }

            hideIntercepted = true;
            hide();
        };

        var toggleInterceptor = function () {
            if (self.getVisible() === true) {
                hideInterceptor();
            } else {
                self.show();
            }
        };

        /**
         * _Disponível apenas para dialog=form_
         *
         * Tira a modal do estado de ocupado.
         *
         * Deve ser chamado quando o processamento client-side em segundo plano tiver terminado. Há três formas de utilizar esse método:
         *
         * | Resultado do processamento | Forma de chamar o método `done()` |
         * |---|---|
         * | Bem sucedido | Chamar o método sem parâmetros ou passando `{success: true}` |
         * | Erro de validação | Aplica-se a formulários validados com o widget [Validation]{@link module:Validation}. Se houver erros de validação (ver evento [pic:validationCompleted]()), chamar passando `{sucess: false}` |
         * | Qualquer outro tipo de erro | Chamar o método passando `{success: false, msg: "Mensagem de erro amigável ao usuário."}` |
         *
         * Quando a modal é informada de que o processamento foi bem sucedida, ela é ocultada; caso contrário, ela permanece visível.
         * Há um *ciclo de vida* associado ao método `done()`. Quando o usuário aciona o botão, a modal passa a aguardar a chamada do método. Nenhuma outra ação pode ser feita até a chamada do método, que "libera" a modal novamente.
         *
         * ```
         *        +-------------------------+
         *   +--->| modal aguardando clique +----+
         *   |    +-------------------------+    |
         *   +                                   v
         * done()                              clique
         *   ^                                   +
         *   |    +-------------------------+    |
         *   +----+ modal aguardando done() |<---+
         *        +-------------------------+
         * ```
         *
         * @method done
         * @param [status] {\{sucess, msg\}} - Objeto que informa à modal o resultado do processamento feito. Formado pelos atributos:
         *  - `success`: Indica sucesso (true) ou falha (false).
         *  - `msg`: Mensagem que será mostrada em caso de falha. Não deve ser informada em caso de sucesso (atualmente ela é desprezada, mas está reservado para uso futuro).
         * @instance
         */
         // Método que tira a modal do estado de ocupado
        var done = function(option) {

            try {
                self.idle();
            } catch(e) {
                if (e) {
                    console.warn(self.name, ': Método done não pode ser executado corretamente. \n' +
                    e + '\n' +
                    'Elemento: ', self.element);
                    return;
                }
            }

            if (!option || option.success === true) {
                cancel(true);
            } else if (option.success === false) {
                if (alert) {
                    alert.remove();
                }
                if (option.msg) {
                    alert = $(alertHtml)
                        .text(option.msg)
                        .prependTo(self.element.find('.modal-body'));
                    PIC.activateWidget("Alert", self.element.parent().find(alert), {}, true);
                }
            }
        };

        // Expõe variáveis da instância
        self.toggle     = toggleInterceptor;
        self.hide       = hideInterceptor;
        self.done       = done;
        self.init       = init;
        self.destroy    = destroy;
        self.cancel     = cancel;

    };

    var ConfirmModal = function() {

        var self = this,
            picConfirmDispatched = false; // Booleano que diz se o evento picConfirm já foi acionado anteriormente

        // Iniciação de modal do tipo confirm
        var init = function() {

            self.buildModalElement();
            createButtons();
            defineClass();
            registerEvents();
        };

        // Registra os eventos da modal
        var registerEvents = function() {
            self.registerEvents();

            self.element.off('hide.bs.modal'  + self.eventNamespace).on('hide.bs.modal' + self.eventNamespace, function (e) {

                var picHideEvent;

                if (!self.getVisible() || self.getTransitioning()) {
                    console.warn(name, ': Evento hide da modal não produziu efeito. \n' +
                        'Para uma mesma modal, não é possível acionar o evento hide enquanto esta estiver em estado de transição ou escondida \n' +
                        'Visível: ', self.getVisible() + '\n' +
                        'Transição: ', self.getTransitioning() + '\n' +
                        'Elemento: ', self.element
                    );
                    // Interrompe o processo de ocultação da modal.
                    e.preventDefault();
                    return;
                }

                if (!picConfirmDispatched) {
                    var result = self.element.triggerHandler('pic:confirm', undefined);
                    if (result === false) {
                        // prevene o fechameno da modal
                        e.preventDefault();
                        return;
                    }
                }

                // Gera e dispara o evento pic:hide
                picHideEvent = $.Event('pic:hide');
                self.element.trigger(picHideEvent);

                // Se pic:hide tiver sido "prevenido".
                if (picHideEvent.isDefaultPrevented()) {
                    // Interrompe o processo de ocultação da modal.
                    e.preventDefault();
                    return;
                }

                // Seta as variáveis de status da Modal
                self.setVisible(false);
                self.setTransitioning(true);

            });

            // Limpa possíveis valores de formulário já preenchidos
            self.element.on('hidden.bs.modal' + self.eventNamespace, function() {
                // Reseta erros colocados pelo validation
                ValidationMediator.resetForm(self.element);

                $(self.element.find('form')).each(function(){
                    this.reset();
                });
            });

            self.element.on('shown.bs.modal' + self.eventNamespace, function(){
                // Se no corpo da modal existir form, o focus ira para o primeiro item focável do form
                self.element.find('.modal-body').find('form').find(':tabbable').first().focus();
                // Reseta o valor da variável picConfirmDispatched sempre que a modal é aberta
                picConfirmDispatched = false;
            });

        };

        // Cria os botões para modal do tipo confirm
        var createButtons = function() {

            // Executa no clique do botão de confirmação (modal confirm)
            var clickConfirm = function (e) {

                var callback,
                    result;

                // O parâmetro "true" passado para triggerHandler indica que o botão de confirmação foi pressionado
                // Se o handler do evento 'pic:confirm' retornar false, aborta a execução
                result = self.element.triggerHandler('pic:confirm', true);
                picConfirmDispatched = true;

                if (result === false) {
                    picConfirmDispatched = false;
                    return;
                }

                // Se foi informada uma função de callback...
                if (typeof self.options.callback.name !== 'undefined') {

                    callback = window[self.options.callback.name];

                    // ... e ele é mesmo uma função
                    if (typeof callback === 'function') {

                        // Executa a função de callback
                        result = callback.apply (this, self.options.callback.params);

                        // Se essa função de callback retornar false, aborta a execução
                        if (result === false) {
                            picConfirmDispatched = false;
                            return;
                        }
                    // O nome informado não corresponde a uma função
                    } else {
                        console.warn ('Modal: "' + self.options.callback.name + '" não é uma função (callback.name).');
                    }
                }

                // Se o formulário indicado existe, faz o submit
                if ($('#' + self.options.formId).length) {
                    $('#' + self.options.formId).submit();
                }

                // Fecha a modal
                self.element.modal('hide');
            };

            // Executa no clique do botão de cancelamento (modal confirm)
            var clickCancel = function (e) {

                var result;

                // O parâmetro "false" passado para triggerHandler indica que o botão de cancelamento foi pressionado
                // Se o handler do evento 'pic:confirm' retornar false, aborta a execução
                result = self.element.triggerHandler('pic:confirm', false);
                picConfirmDispatched = true;

                if (result === false) {
                    picConfirmDispatched = false;
                    return;
                }

                // Fecha a modal
                self.element.modal('hide');
            };

            var buttonLabels = ['Sim', 'Não'];

            if (self.options.labels) {

                if ($.isArray(self.options.labels)) {
                    $.extend(true, buttonLabels, self.options.labels);
                } else {
                    buttonLabels[0] = self.options.labels;
                }
            }

            self.element.find('.modal-content').append('<div class="modal-footer"></div>');

            self.element.find('.modal-footer')
                .append('<button type="button" class="btn btn-sim btn-default">' + buttonLabels[0] + '</button>')
                .append('<button type="button" class="btn btn-nao btn-secondary">' + buttonLabels[1] + '</button>');

            self.element.find('.btn-sim').on('click' + self.eventNamespace, clickConfirm);
            self.element.find('.btn-nao').on('click' + self.eventNamespace, clickCancel);
        };

        // Define classe para modal do tipo confirm
        var defineClass = function() {
            if (self.options.type === 'warning') {
                self.element.find(".modal-dialog").addClass('modal-' + self.options.size + ' alertBox ' + self.typeMap[self.options.type]);
            } else {
                self.element.find(".modal-dialog").addClass('modal-' + self.options.size + ' alertBox');
            }
        };

        // Destrói o elemento para modal do tipo confirm
        // Este método deve chamar o método genérico "destroyBase" que destrói elementos comuns para os tipos de modal
        var destroy = function() {
            self.destroyBase();
        };

        // Expõe variáveis da instância
        self.init       = init;
        self.destroy    = destroy;

    };

    var AlertModal = function() {

        var self = this;

        // Iniciação de modal do tipo alert
        var init = function() {

            self.buildModalElement();
            createButtons();
            defineClass();
            registerEvents();
        };

        // Registra os eventos da modal
        var registerEvents = function() {
            self.registerEvents();

            // Limpa possíveis valores de formulário já preenchidos
            self.element.on('hidden.bs.modal' + self.eventNamespace, function() {
                // Reseta erros colocados pelo validation
                ValidationMediator.resetForm(self.element);

                $(self.element.find('form')).each(function(){
                    this.reset();
                });
            });

            // Se no corpo da modal existir form, o focus ira para o primeiro item focável do form
            self.element.on('shown.bs.modal' + self.eventNamespace, function(){
                self.element.find('.modal-body').find('form').find(':tabbable').first().focus();
            });
        };

        // Cria os botões para modal do tipo alert
        var createButtons = function() {
            self.element.find('.modal-content').append('<div class="modal-footer"></div>');
            self.element.find('.modal-footer').append('<button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>');
        };

        // Define classe para modal do tipo alert
        var defineClass = function() {
            self.element.find(".modal-dialog").addClass('modal-sm  alertBox ' + self.typeMap[self.options.type]);
        };

        // Destrói o elemento para modal do tipo alert
        // Este método deve chamar o método genérico "destroyBase" que destrói elementos comuns para os tipos de modal
        var destroy = function() {
            self.destroyBase();
        };

        // Expõe variáveis da instância
        self.init       = init;
        self.destroy    = destroy;
    };

    var DefaultModal = function() {

        var self = this;

        // Iniciação de modal do tipo default
        var init = function() {

            self.buildModalElement();
            createButtons();
            defineClass();
            registerEvents();
        };

        // Registra os eventos da modal
        var registerEvents = function() {
            self.registerEvents();

            // Limpa possíveis valores de formulário já preenchidos
            self.element.on('hidden.bs.modal' + self.eventNamespace, function() {
                // Reseta erros colocados pelo validation
                ValidationMediator.resetForm(self.element);

                $(self.element.find('form')).each(function(){
                    this.reset();
                });
            });

            // Se no corpo da modal existir form, o focus ira para o primeiro item focável do form
            self.element.on('shown.bs.modal' + self.eventNamespace, function(){
                self.element.find('.modal-body').find('form').find(':tabbable').first().focus();
            });

        };

        // Cria os botões para modal do tipo default
        var createButtons = function() {
            var customButtonsWrapper,
            customButtons,
            buttonLabel = 'Fechar';

            customButtonsWrapper = self.element.find('.modal-body .buttons');

            // Se foram definidos botões personalizados
            if (customButtonsWrapper.length) {

                // Adiciona a classe prevista pelo Bootstrap
                // Destaca os botões de onde eles estão e coloca no final de 'modal-content'
                customButtonsWrapper
                    .addClass('modal-footer')
                    .detach().appendTo( self.element.find('.modal-content') );

                customButtons = customButtonsWrapper.children();

                // Remove dessa região tudo o que não for botão
                // (é uma restrição mesmo, preço que se paga pela padronização)
                customButtons.not('button').remove();
                // Adiciona as classes previstas pelo Bootstrap
                customButtons.addClass('btn');
                customButtons.filter(':not(.btn-secondary)').addClass('btn-default');
                // Botão fecha a modal, por padrão; a menos que esteja marcado com 'noclose'.
                customButtons.not( customButtons.filterByConfig(self.name, 'noclose') ).attr('data-dismiss', 'modal');

            // Se não há botões personalizados, cria o botão padrão
            } else {

                // Se há labels personalizados
                if (self.options.labels) {
                    if ($.isArray(self.options.labels)) {
                        buttonLabel = self.options.labels[0];
                    } else {
                        buttonLabel = self.options.labels;
                    }
                }
                self.element.find('.modal-content').append('<div class="modal-footer"></div>');
                self.element.find('.modal-footer').append('<button type="button" class="btn btn-default" data-dismiss="modal">' + buttonLabel + '</button>');
            }
        };

        // Define classe para modal do tipo default
        var defineClass = function() {
            self.element.find(".modal-dialog").addClass("modal-lg");
        };

        // Destrói o elemento para modal do tipo default
        // Este método deve chamar o método genérico "destroyBase" que destrói elementos comuns para os tipos de modal
        var destroy = function() {
            self.destroyBase();
        };

        // Expõe variáveis da instância
        self.init       = init;
        self.destroy    = destroy;

    };

    Modal.prototype = {

        name: 'Modal',

        defaults: {
            title: 'Mensagem da página',
            dialog: 'default',
            type: 'default',
            size: 'sm',
            callback: {}
        },

        domains: {
            dialog: ['default', 'confirm', 'alert', 'form'],
            type: ['default', 'info', 'success', 'warning', 'error'],
            size: ['sm', 'md', 'lg']
        }
    };

    /*
     * Solicita o registro do widget
     */
    PIC.widgetRegister(Modal);

})(jQuery, window, document);

})();
/* Início de novo arquivo concatenado */
(function () {/* Autocomplete */
/**
Transforma um input de texto em um campo autocomplete.

O conjunto de opções que serão mostradas pelo Autocomplete deve ser informado como um array JSON.
Cada elemento do array corresponde a uma opção, e todos eles devem estar em um dos seguintes
formatos:
- String. Por exemplo: `["Primeiro", "Segundo", "Terceiro"]`
- Objeto `{label, value}`. Por exemplo: `[{"value":"1", "label":"Um"}, {"value":"2", "label":"Dois"}, {"value":"3", "label":"Três"}]`

##### Como os valores informados são utilizados?

O valor da chave `label` é o que será mostrado para o usuário, na lista de opções.

Quando o tipo é `suggestion`:
- A chave `value` é ignorada (não é utilizada).
- Na submissão do formulário, o valor do campo corresponde a seu conteúdo.

Quando o tipo é `selection`:
- Na submissão do formulário, o valor do campo será o valor da chave `value` correspondente à opção selecionada.
- No momento da submissão do formulário, se o conteúdo digitado no campo não corresponder a uma
  das opções, ou se ele não puder ter sido validado, o valor do campo será correspondente a seu
  conteúdo, mas acrescido de um prefixo que indique essa situação. Ver parâmetros `invalidPrefix` e
  `rawPrefix`.

__Observação__: Se as opções forem informadas como _string_, o widget usará esse mesmo valor tanto para `label` quanto para `value`.

##### Espaços em branco

Espaços em branco serão desconsiderados. Isso implica em que:
 - Os espaços em branco presentes no início e no final do campo de entrada não irão interferir na correspondência com os valores disponíveis;
 - Os espaços em branco no início e no final de cada opção da fonte de dados não irão interferir na correspondência com o valor digitado;

@module Autocomplete
@attribute data-pic-autocomplete
@param {string} source - Indica a localização da fonte de dados. Pode ser:
- A URI de um arquivo JSON contendo as opções do autocomplete.
  O widget obterá o arquivo e ele mesmo filtrará que opções serão mostradas ao usuário.
  Nesse caso, use `sourceType=uri`
- Um seletor jQuery que enderece um `input type=hidden`, cujo valor seja um JSON contendo as opções
  do autocomplete. Assim como no caso anterior, o próprio widget filtrará as opções.
  Nesse caso, use `sourceType=hidden`
- A URI de um recurso que forneça um JSON contendo as opções que devem ser
  mostradas de acordo com o valor digitado pelo usuário. O valor digitado é informado pelo parâmetro
  `term` (método GET).
  Assim, por exemplo, a URI for `http://exemplo.leg.br/deputados.asp`,
  o widget fará uma requisição no formato `http://exemplo.leg.br/deputados.asp?term=valor`.
  Nesse caso, use `sourceType=serverControl`
@param {string} [sourceType=uri] - Indica o tipo da fonte de dados para o autocomplete.
       Note que tem forte relação com o parâmetro `source`.
       Valores possíveis: uri|hidden|serverControl.
@param {string} [type=suggestion] - Indica o tipo de Autocomplete, ou seja, se ele apenas sugere valores, ou se força a seleção de um valor.
       Valores possíveis: suggestion|selection
@param {string} [invalidPrefix=invalid::] - Se o usuário preencher o campo com algo que não corresponda a uma das opções disponívels, na submissão do formulário ele será prefixado com o valor informado nesse parâmetro.
       Usado apenas quando `type=suggestion`.
@param {string} [rawPrefix=raw::] - Se o usuário submeter o formulário antes que o widget tenha conseguido verificar (junto ao servidor) se o valor digitado corresponde a uma das opções disponíveis, ele será prefixado com o valor informado nesse parâmetro.
       Usado apenas quando `type=suggestion` e `sourceType=serverControl`.
@param {JSON} [requestHeaders] - Cabeçalhos adicionais a serem passados na requisição remota de dados.
       Aceita um JSON contendo chaves e valores dos cabeçalhos. Ex.: {"Authorization": "token"}.
       Usado apenas quando `sourceType=uri` ou `sourceType=serverControl`.

@example <caption>Uso mais básico, apenas indicando o arquivo JSON contendo os dados</caption>       
<div class="form-group">
    <label for="nome">Nome</label>
    <input id="nome" data-pic-autocomplete='{"source":"data/nomes.json"}' type="text" class="form-control" name="nome">
</div>

@example <caption>Informando que os dados estão contidos num campo hidden, e que um valor deve ser selecionado pelo usuário</caption>
<!-- Note que, nesse exemplo, se o usuário digitar algo que não está na lista, como por exemplo, "Deputado 5", o valor será prefixado na submissão do formulário.
     Assim, no lado do servidor, chegaria, como valor do campo `dep`, o string: "invalid::Deputado 5"
-->
<div class="form-group">
    <label for="dep">Deputado</label>
    <input id="dep" data-pic-autocomplete='{"source":"#listaDep", "sourceType":"hidden", "type":"selection"}' type="text" class="form-control" name="dep">
    <input id="listaDep" type="hidden" value='["Deputado 1", "Deputado 2", "Deputado 3", "Deputado 4"]'>
</div>

*/
;(function ($, window, document, undefined) {

    'use strict';

    /*
     * Variáveis globais
     * no escopo da closure
     */

    // Indica que o 'matching' entre o que foi digitado e as opções disponíveis deve ser normalizado, o que quer dizer:
    // - ignorar acentos;
    // - ignorar diacríticos (acentos, cedilha etc).
    // Essa variável (constante) foi colocada aqui, mas é candidata, no futuro, a ser um parâmetro
    // de configuração do Autocomplete.
    var normalize = true,
        // Quantidade mínima de caracteres que precisam ser digitados para mostrar as sugestões.
        MIN_LENGTH = 1,
        // Número máximo de sugestões que serão mostradas.
        // Se for alterado, deve ser preciso rever MAX_HEIGHT.
        MAX_ITEMS = 10,
        // Altura máxima (em px) da lista de sugestões.
        // @TODO Rever esse valor. No CSS, 'max-height' está definido como '9.2em'.
        //       Talvez o ideal seja definir em pixels nos dois lugares, ou até mesmo deixar
        //       totalmente por conta do script a definição de altura do elemento.
        MAX_HEIGHT = 180, //px ----> (12em x 15(px/em) = 180px),
        // Timeout das requisições ajax (em milissegundos)
        AJAX_TIMEOUT = 10000,
        INVALID_MSG = "O termo informado não foi validado pelo sistema.",
        EMPTY_DATA = [];

    /* -----------------------------------------------------------------------------------------
     * Integração com o Validation
     */

    // Regra de validação para campos autocomplete do tipo 'selection'
    // Indica erro se o valor que o campo for entregar ao formulário estiver prefixado com a
    // indicação de que é inválido.
    // Indica erro também se o proxy não existir.
    var validSelection = function (value, field) {

        var invalidPrefix = field.data('picInvalidPrefix'),
            proxy = field.nextAll('input[type=text]').first();

        // Se o proxy existe e valor do proxy não inicia pelo prefixo de inválido, retorna true;
        return (proxy.length !== 0) && (proxy.val().indexOf(invalidPrefix) !== 0);
    };

    PIC.Validation.setRule('selection', validSelection, INVALID_MSG);

    /* -----------------------------------------------------------------------------------------
     * Funções utilitárias
     */

    /* Retira os acentos de uma string */
    // @TODO remover essa função genérica daqui
    function removeAccents(str) {
      var accents    = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
      var accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
      str = str.split('');
      var strLen = str.length;
      var i, x;
      for (i = 0; i < strLen; i++) {
        if ((x = accents.indexOf(str[i])) != -1) {
          str[i] = accentsOut[x];
        }
      }
      return str.join('');
    }

    // Dado um string (value), retorna esse mesmo string normalizado,
    // de acordo com os parâmetros informados
    // - trim: remove espaços antes e depois
    // - clearAccents: remove os acentos/diacríticos
    // - lowerCase: transforma para minúsculas
    var toNormalized = function (value, trim, clearAccents, lowerCase) {

        // Parâmetros são 'true' por default
        trim =         (trim !== undefined ?           trim :          true);
        clearAccents = (clearAccents !== undefined ?   clearAccents :  true);
        lowerCase =    (lowerCase !== undefined ?      lowerCase :     true);

        // Testa cada parâmetro de normalização
        // e faz as transformações necessárias na variável
        value = trim ?         value.trim() :         value ;
        value = clearAccents ? removeAccents(value) : value ;
        value = lowerCase ?    value.toLowerCase() :  value ;

        return value;
    };

    // Transforma um string em um objeto do tipo {value, label}
    var stringToObject = function (string) {
        return {value: string, label: string};
    };

    // Garante que o array esteja no formato esperado (array de objetos {label, value})
    // - array: Array de strings ou array de objetos
    // Retorna o array no formato esperado
    var formatArray = function (array) {
        // O parâmetro passado pode ser um array de string, ou um array de objetos {value, label}
        // Testamos a primeira posição do array para definir o que fazer com ele.
        // É pressuposto que todas as posições do array possuam o mesmo formato.
        // Portanto, se diferentes posições do array contiverem dados em formatos diferentes,
        // estamos sujeitos a algum tipo de erro aqui.
        // ---
        // Se o primeiro valor é um string, é preciso transformar
        if (typeof array[0] === 'string') {
            // Para cada posição do array, transforma o string em um objeto {value, label}
            $.each(array, function (index, string) {
                array[index] = stringToObject($.trim(string));
            });
        }
        // Retorna data no formato de array de objetos {label, value}
        return (array);
    };

    // Recebe um array de objetos que possuam a propriedade 'label',
    // e retorna o mesmo array, acrescentando a propriedade 'normalizedLabel' nesses objetos
    // - data: o array de objetos
    // - trim: indica se deve remover espaços no início e no final do label
    // - clearAccents: indica se deve remover acentos
    // - lowerCase: indica se deve ser colocado em caixa baixa
    // Retorna o array com objetos adicionados da propriedade 'normalizedLabel'
    var createNormalizedLabel = function (array, trim, clearAccents, lowerCase) {

        var label;

        // Para cada posição do array
        $.each(array, function (index, object) {
            // Guarda o valor da propriedade label, normalizada conforme indicado
            label = toNormalized(object.label, trim, clearAccents, lowerCase);
            // Cria 'normalizedLabel' no objeto, com o valor da variável
            $.extend(object, {normalizedLabel : label});
        });

        // Retorna o array com objetos adicionados da propriedade 'normalizedLabel'
        return array;
    };

    // Filtra o array 'data' de acordo com 'term', retornando as entradas parcialmente correspondentes.
    // Retorna as entradas em que 'term' (normalizado) está contido na propriedade 'normalizedLabel'
    var partialMatches = function (data, term, trim, ignoreAccents, lowerCase) {

        var filtered;

        // Faz as transformações de normalização no termo de busca informado,
        // de acordo com os parâmetros.
        term = toNormalized(term, trim, ignoreAccents, lowerCase);

        // Cria um novo array que contenha apenas as entradas que tenham correspondência
        // parcial com o termo informado; armazenar em filtered
        filtered = $.grep(data, function (object) {
            // Retorna true se term estiver contido em normalizedLabel
            return object.normalizedLabel.indexOf(term) !== -1;
        });

        // Retorna o array de objetos filtrados
        return filtered;
    };

    // Filtra o array 'data' de acordo com 'term', retornando apenas as entradas correspondentes.
    // Retorna as entradas em que 'term' (normalizado) é igual à propriedade 'normalizedLabel'
    var fullMatches = function (data, term, trim, ignoreAccents, lowerCase) {

        var filtered;
        // Faz as transformações de normalização no termo de busca informado,
        // de acordo com os parâmetros.
        term = toNormalized(term, trim, ignoreAccents, lowerCase);

        // Cria um novo array que contenha apenas as entradas que correspondam
        // ao termo informado; armazenar em filtered
        filtered = $.grep(data, function (object) {
            return term === object.normalizedLabel;
        });

        // Retorna o array de objetos filtrados
        return filtered;
    };

    // Faz uma busca no array 'data' de acordo com 'term', retornando:
    // - A entrada principal (a primeira encontrada por 'fullMatches'); ou
    // - undefined se não há correspondência com 'term'
    var mainMatch = function (data, term, trim, ignoreAccents, lowerCase) {
        var filtered,
            matched;

        filtered = fullMatches(data, term, trim, ignoreAccents, lowerCase);
        matched = filtered.length ? filtered[0] : undefined ;
        
        return matched;
    };

    /*
     * Definição da classe
     */

    var Autocomplete = function (widgetHelper) {

        /*
         * Variáveis de instância
         */
        var name = this.name,
            element = widgetHelper.element,
            options = widgetHelper.options,
            eventNamespace = widgetHelper.eventNamespace,
            api = {},
            // Armazena refência aos ícones criados (Autocomplete, Pending, Warning)
            spanAutocomplete,
            spanPending,
            spanWarning,
            // Armazena o elemento span que será adicionado no DOM para o ícone invisível
            spanInvisibleIcon,
            // Armazena o elemento input hidden que guarda o 'value' para o tipo 'selection';
            proxyHidden,
            // Armazena os valores disponíveis
            // Não utilizado para 'serverControl', já que, nesse caso, sempre que o widget precisa
            // dos dados, ele deve solicitar novamente ao servidor
            data = EMPTY_DATA,
            // Indica que os dados já foram carregados (estão prontos para uso).
            // Não utilizado para 'serverControl'
            dataReady = false,
            // Elemento do DOM onde a lista de opções (menu) deve ser colocada
            menuContainer,
            // Flag que indicará se o Autocomplete (Plugin) foi iniciado ou não
            autocompletePluginInitiated = false,
            // Estado do autocomplete quando for serverControl
            status = 'normal',
            // Contador para controlar requisições feitas e retornadas pelo servidor
            draw = 0,
            // Cache utilizado por serverControl, para evitar repetidas requisições ao servidor.
            cache = [],
            // Contém o item selecionado para ser entregue ao servidor
            currentItem;

        // Destroi a instância do widget
        var destroy = function () {

            // Remover listener de eventos
            widgetHelper.clearEvents();
            spanAutocomplete.off(eventNamespace);

            // Verifica se o Plugin foi instanciado, se sim (true) o método destroy do Plugin é chamado
            if (autocompletePluginInitiated) {
                // Chama o método "destroy" do plugin (Autocomplete JqueryUI)
                element.autocomplete('destroy');
            }

            // Para tipo 'selection'
            if (options.type === 'selection') {
                // Limpa eventual mensagem de erro
                setInlineError(false);
                // Remove o campo hidden que servirá como 'proxy',
                // devolvendo antes o atributo 'name' para o input original.
                element.attr('name', proxyHidden.attr('name'));
                proxyHidden.remove();
                // Destrói o Tooltip e remove o ícone de warning
                PIC.destroyWidget("Tooltip", spanWarning, true);
                spanWarning.remove();
            }
            
            // Para 'serverControl'
            if (options.sourceType === 'serverControl') {
                // Remove o ícone de requisição pendente
                spanPending.remove();
            }

            // Destrói o Tooltip e remove o ícone invisível
            PIC.destroyWidget("Tooltip", spanInvisibleIcon, true);
            spanInvisibleIcon.remove();

            // Destrói o Tooltip e remove o ícone referente ao Autocomplete
            PIC.destroyWidget("Tooltip", spanAutocomplete, true);
            spanAutocomplete.remove();

            // Remove os atributos de acessibilidade
            element.removeAttr('role aria-autocomplete');

            // Remove o container para o menu do Plugin
            menuContainer.remove();

            // Remove o container com classes necessárias para a estilização dos ícones
            element.unwrap();
        };

        /* -----------------------------------------------------------------------------------------
         * Funções de obtenção e busca de dados
         */

        // Obtém dados do campo informado como parâmetro
        // - field: seletor jQuery correspondente ao campo hidden que contém os dados
        // - callback: função que será disparada quando os dados estiverem disponíveis
        var requestDataFromHidden = function (field, callback) {

            var data = $(field).val();

            try {
                // Faz o parse do conteúdo obtido
                data = JSON.parse(data);
            }
            // Caso aconteça algum erro no parser:
            catch (exception) {
                // Força um array vazio em data.
                data = EMPTY_DATA;
                // Avisa sobre o erro ocorrido.
                console.warn(name + ': O valor informado no campo hidden indicado não é um JSON válido.\n',
                             'Não foi possível iniciar corretamente o widget no elemento ', element);
            }
            // Avisa que os dados estão disponíveis
            callback(data);
        };

        // Obtém dados da uri informada como parâmetro
        // - uri: URI da fonte de dados
        // - callback: função que será disparada quando os dados estiverem disponíveis
        var requestDataFromUri = function (uri, callback) {

            // Obtém os dados remotamente
            // Quando os dados estiverem disponíveis, dispara o callback
            // @TODO Ao contrário do que foi feito para 'serverControl', aqui não temos um
            //       controle mais preciso do que ocorrerá em caso de erro do servidor
            //       ou timeout. Isso pode ser melhor trabalhado.
            $.ajax({
                dataType: "json",
                url: uri,
                headers: options.requestHeaders,
                success: callback
              });
        };
        
        // Faz a requisição ajax, 
        // Loga em caso de erro,
        // Retorna o retorno da chamada ajax do jquery, permitindo o encadeamento
        // de funções que serão executadas em caso de sucesso ou falha
        // (http://api.jquery.com/jquery.ajax/)
        var rqBasic = function (uri, term) {
            
            var deferred;
            
            // Normaliza termo;
            term = toNormalized(term);

            deferred = $.ajax({
                dataType: 'json',
                headers: options.requestHeaders,
                url: options.source,
                data: { term: term },
                timeout: AJAX_TIMEOUT
            })
                // Requisição falhou
                .fail(function (jqxhr, textStatus, error) {

                    // Se o status de erro for igual a zero
                    if (jqxhr.status === 0) {

                        if (error === "timeout") {

                            console.warn("Autocomplete: Tempo de espera encerrado.", element);
                        }
                        else {
                            console.warn("Autocomplete: Network Problem", element);
                        }
                    }
                    else {
                        console.warn("Autocomplete: Status Code: " + jqxhr.status + " " + error, element);
                    }
                });

            return deferred;            
        };
        
        // Concluída a requisição básica
        // formata e normaliza o resultado
        // e depois avisa que a requisição foi resolvida
        var rqFormated = function (uri, term) {
            
            var deferred;
            
            deferred = $.Deferred();
            
            rqBasic(uri, term)
                .done(function (result) {
                    // Coloca o resultado no formato esperado,
                    // e mantém apenas os primeiros MAX_ITENS no array.
                    result = formatArray(result).slice(0, MAX_ITEMS);
                    // Cria label normalizado
                    // - removendo espaços em branco
                    // - removendo acentos de acordo com o valor de normalize
                    // - colocando em caixa baixa de acordo com o valor de normalize
                    result = createNormalizedLabel(result, true, normalize, normalize);
                    // Avisa que terminou
                    deferred.resolve(result);
                })
                .fail(function () {
                    deferred.reject();
                });

            return deferred;
        };
        
        // Evita requisição remota se houver dados em cache.
        // Se os dados vieram do servidor, atualiza cache.
        var rqCached = function (uri, term) {
            
            var deferred;
            
            deferred = $.Deferred();
            
            // Normaliza termo;
            term = toNormalized(term);

            // Se termo estiver em cache
            if (term in cache) {
                // Avisa que já obteve os dados
                deferred.resolve(cache[term]);
            }
            else {
                
                rqFormated(uri, term)
                    .done(function (result) {
                        // Grava esse resultado em cache
                        cache[term] = result;
                        // E avisa que a requisição foi resolvida
                        deferred.resolve(result);
                    })
                    .fail(function () {
                        deferred.reject();
                    });
            }

            return deferred;
        };
        
        // Faz o controle das requisições: internamente e visualmente
        // Internamente: Ignora os retornos de requisições "antigas", ou seja,
        // considera apenas o retorno da requisição mais recente realizada.
        // Dizendo de outra forma, as requisições "antigas" ficam sem resposta, como
        // se nunca tivessem sido completadas.
        // Visualmente: Controla a visibilidade do ícone 'pending', garantindo que ele seja
        // mostrado enquanto a requisição mais recente esteja pendente.
        var rqPending = function (uri, term) {
            
            var deferred,
                latestDraw;
                
            // Mostra o ícone 'loading' (garantindo que o ícone 'warning' não esteja visível)
            if (options.type === 'selection') {
                setWarningIcon(false);
            }
            setPendingIcon(true);
            
            // Armazena o número da requisição mais recente
            // A ideia aqui é que se essa função for chamada mais de uma vez antes que o servidor
            // responda (por ser um processo assíncrono), apenas a última chamada tenha algum
            // efeito prático. Apenas na chamada mais recente é que latestDraw e draw 
            // permanecem com o mesmo valor.
            latestDraw = ++draw;

            deferred = $.Deferred();
            
            rqCached(uri, term)
                .done(function (result) {
                    // Se for a requisição mais recente, avisa que foi resolvida
                    if (draw === latestDraw) {

                        deferred.resolve(result);
                    }
                })
                .fail(function () {
                    // Se for a requisição mais recente, avisa que foi rejeitada
                    if (draw === latestDraw) {

                        deferred.reject();
                    }
                })
                .always(function () {
                    // Se for a requisição mais recente
                    // De forma que o 'loading' desapareça apenas quando a requisição mais recente
                    // for concluída, seja com sucesso ou não.
                    if (draw === latestDraw) {

                        setPendingIcon(false);
                    }
                });

            return deferred;
        };

        // Obtém dados da fonte informada como parâmetro, de acordo com seu tipo
        // - source: URI ou seletor jQuery do campo hidden que contém os dados
        // - type: tipo da fonte (URI, hidden)
        // - callback: função que será disparada quando os dados estiverem disponíveis
        var requestData = function (source, sourceType, callback) {

            // Dados não serão requisitados duas vezes.
            // Se já estiverem prontos, aborta a execução.
            if (dataReady) {
                return;
            }

            // Escolhe que função chamar de acordo com sourceType
            switch (sourceType) {

                case 'uri':
                    requestDataFromUri(source, callback);
                    break;

                case 'hidden':
                    requestDataFromHidden(source, callback);
                    break;
            }
        };

        // Função de busca que será informada para o Plugin
        // quando a busca é feita em client-side
        // O momento da chamada dessa função compete com o momento da chamada a 
        // 'onTextchange'. Entretando, onTextchange é chamada mesmo quando o campo
        // torna-se vazio, e por isso ele é necessária. Não fosse isso, o que 
        // ela executa poderia estar contido aqui.
        var searchCallback = function (request, response) {

            var filtered;

            // Controla o posicionamento do menu (acima/abaixo)
            solveMenuPosition();
            // Faz o filtro de acordo com o termo informado
            filtered = partialMatches(data, request.term);
            // Retorna os dados já filtrados
            // A quantidade de resultados mostrados será limitada a MAX_ITEMS
            response(filtered.slice(0, MAX_ITEMS));
        };
        
        // Função de busca que será informada para o Plugin
        // quando a busca é feita em server-side (serverControl)
        // Diferentemente do caso de client-side, aqui, a relação entre essa função e a 
        // 'onTextchangeSC' é mais complexa. Isso ocorre devido ao keystrokeDelay diferente de zero.
        // Assim, onTextchangeSC é disparada imediatamente quando o valor do campo é modificado,
        // e tratando que pode (e deve) ser tratado independentemente do resultado da busca
        // Note que 'handleValue' é chamada aqui (e não em onTextchangeSC), porque depende dos
        // valores retornados pelo servidor.
        var searchCallbackSC = function (request, response) {
            
            // Faz a requisição no servidor indicado em 'source',
            // com o parâmetro de busca 'term'.
            rqPending(options.source, request.term)
                // A requisição foi bem sucedida
                .done(function (filtered) {
                    // Controla o posicionamento do menu (acima/abaixo)
                    solveMenuPosition();
                    // Se for 'selecion', é preciso validar o que foi informado no campo.
                    if (options.type === 'selection') {
                        handleValue(filtered, request.term);
                    }
                    // Informa ao Plugin que a busca terminou (passa as opções disponíveis)
                    response(filtered);
                })
                // A requisição falhou
                .fail(function () {
                    // De toda forma, informa ao Plugin que a busca terminou (sem opções).
                    response(EMPTY_DATA);
                });
        };        
        

        /* -----------------------------------------------------------------------------------------
         * Funções de indicação visual de erro e status
         */

        // De acordo com o parâmetro visible, define se o ícone de alerta será ou não mostrado
        var setWarningIcon = function (visible) {
            var display;

            display = visible ? 'inline-block' : 'none' ;

            spanWarning.css('display', display);
        };

        // De acordo com o parâmetro visible, define se o erro inline será ou não mostrado
        var setInlineError = function (visible) {

            if (visible) {
                PIC.Validation.markError(element, INVALID_MSG);
            }
            else {
                PIC.Validation.clearError(element);
            }
        };
        
        // De acordo com o parâmetro visible, define se o ícone de pendência será ou não mostrado
        var setPendingIcon = function (visible) {
            var display;

            display = visible ? 'block' : 'none' ;
            
            spanPending.css("display", display);
        };
        

        /* -----------------------------------------------------------------------------------------
         * Funções de inclusão, manipulação e visibilidade de elementos no DOM
         */

        // Adiciona ícone do Aucomplete (indica 'suggestion' ou 'selection') para auxílio ao usuário
        var addAutocompleteIcon = function (type) {

            var tooltipOptions,
                tooltipText;

            spanAutocomplete = $('<span>');

            switch (type) {
                case 'suggestion':
                    spanAutocomplete.addClass('icoAutoComplete');
                    break;
                case 'selection':
                    spanAutocomplete.addClass('icoAutoCompleteLista');
                    break;
            }

            // Insere o elemento no parent do elemento e define um id único para ele.
            spanAutocomplete
                .appendTo(element.parent())
                .uniqueId();

            tooltipText = MIN_LENGTH <= 1 ? "Comece a digitar para obter assistência do sistema." : "Entre com "+ MIN_LENGTH +" caracteres ao menos para obter assistência do sistema.";

            tooltipOptions = {
                "text": tooltipText,
                "trigger": "hover"
            };

            PIC.activateWidget("Tooltip", spanAutocomplete, tooltipOptions, true);
        };

        // Adiciona ícone que indica que há algo pendente na operação do Autocomplete (serverControl)
        var addPendingIcon = function () {
            
            spanPending = $('<span class="spinningAutocomplete"></span>');
            spanPending.appendTo(element.parent());
        };

        // Adiciona ícone de alerta para quando o valor inserido não corresponder com as sugestões do Autocomplete selection
        var addWarningIcon = function () {

            var tooltipOptions;

            spanWarning = $("<span class='icoAvisoAutoComplete fadeIn animated'></span>");

            spanWarning
                .appendTo(element.parent())
                .uniqueId()
                .css('display', 'none');

            tooltipOptions = {
                "text": "O sistema não encontrou ao menos uma correspondência para o termo informado.",
                "trigger" : "hover"
            };

            PIC.activateWidget("Tooltip", spanWarning, tooltipOptions, true);
        };

        // Adiciona "ícone" invisível para servir de ponto de disparo do Tooltip visualmente
        // associado ao próprio input.
        var addInvisibleIcon = function () {

            var tooltipOptions,
                tooltipText,
                tooltipTimer;

            // Armazena referência ao elemento invisível que recebe o Tooltip ao focar no input e não realizar ação
            spanInvisibleIcon = $("<span class='icoInvisible'></span>");

            spanInvisibleIcon
                .appendTo(element.parent())
                .uniqueId();

            tooltipText = MIN_LENGTH === 1 ? "Comece a digitar para obter assistência do sistema." : "Entre com "+ MIN_LENGTH +" caracteres ao menos para obter assistência do sistema.";

            tooltipOptions = {
                "text": tooltipText,
                "trigger": "manual"
            };

            PIC.activateWidget("Tooltip", spanInvisibleIcon, tooltipOptions, true);

            // --
            // O comportamento programado pelas funções e eventos abaixo é o seguinte:
            // Se o campo recebe o foco, depois de um tempo será mostrado um tooltip associado
            // ao campo orientando o usuário quanto a seu uso. A exibição do tooltip será cancelada
            // (será ocultado se já tiver sido mostrado, e não será mais mostrado caso ainda
            // não tenha sido mostrado) nas seguintes situações:
            // - O usuário pressiona alguma tecla (começa a digitar)
            // - O usuário tira o foco do campo
            // - O usuário passa o mouse sobre o ícone que identifica o campo como Autocomplete
            // Caso o tooltip já tenha sido mostrado, se o usuário pressionar ESC, ele é ocultado.
            // -

            // Função que inicia o timer para o tooltip associado (visualmente) a element.
            var setTooltipTimer = function () {
                tooltipTimer = setTimeout(function() {
                    spanInvisibleIcon.picTooltip().show();
                }, 3000);
            };

            // Limpa o timer do tooltip (evita que ele seja mostrado depois) e
            // determina que ele seja escondido (para o caso de ele já ter sido mostrado)
            var haltTooltip = function () {
                clearTimeout(tooltipTimer);
                spanInvisibleIcon.picTooltip().hide();
            };

            // Dispara o timer quando element receber o foco
            element.on("focus" + eventNamespace, function() {
                setTooltipTimer();
            });

            // Quando uma tecla for pressionado ou element perder o foco,
            // interrompe o timer e esconde o tooltip.
            element.on("keypress" + eventNamespace + " blur" + eventNamespace, haltTooltip);

            // Quando o mouse passar sobre o ícone (que mostra seu próprio tooltip),
            // interrompe o timer e esconde o tooltip.
            spanAutocomplete.on("mouseover" + eventNamespace, haltTooltip);

            element.on("keyup" + eventNamespace, function(e) {
                // Ao pressionar 'esc', esconde o tooltip.
                if (e.which == key.esc) {
                    spanInvisibleIcon.picTooltip().hide();
                }
            });
        };

        // Adiciona um input type=hidden que servirá de proxy para entregar ao servidor o valor
        // associado à opção selecionada (atributo 'value') para Autocomplete 'selection'
        var addProxyHidden = function () {

            var nameAttr;

            // Obtém o atributo 'name' do input e
            // remove esse atributo (para não submeter o valor contido lá)
            nameAttr = element.attr('name');
            element.removeAttr('name');

            // Cria um input hidden logo após o input
            // Esse elemento vai guardar o valor esperado na submissão do form,
            // pois é criado com o 'name' do input original
            proxyHidden = $('<input>').
                attr({
                    'type': 'text',
                    'name': nameAttr,
                    'value': '',
                    'style': 'display:none'
                });
            element.after(proxyHidden);
        };

        // Resolve em que posição o menu (lista de opções) deve ficar, se acima ou abaixo
        // do campo de entrada.
        // Essa função, apesar de ter relação com a visibilidade do menu (e não com a pesquisa),
        // é chamada dentro dos callback de pesquisa, porque se for chamada no evento 'open'
        // será tarde demais, porque o menu já terá sido mostrado.        
        var solveMenuPosition = function () {

            menuContainer.children().css('left', '0');

            // Se a lista mostrada cabe para baixo
            if (widgetHelper.fitDown(element, MAX_HEIGHT)) {
                // Abre para baixo
                element.autocomplete( "option", "position", { my : "left top", at: "left bottom" });
            }
            else {
                // Abre para cima
                element.autocomplete( "option", "position", { my : "left bottom", at: "left top" });
            }
        };


        /* -----------------------------------------------------------------------------------------
         * Funções de tratamento dos valores do campo
         */

        // Dado um item (do menu), expõe esse item na interface
        // A exposição consiste em mostrar adequadamente:
        // - O valor visível (label) no próprio input do Autocomplete (element)
        // - O valor interno (value) no proxy, no caso de 'selection'
        var exposeItem = function (item) {
            var label,
                value,
                fieldVal = element.val();

            // -- Definindo valor do campo visível (label)

            // label do item; ou o label já presente no input se item for undefined
            label = typeof item === 'object' ? item.label : fieldVal;
            // Expõe o label
            element.val(label);

            // -- Definindo o valor do proxy, valor que será entregue ao formulário (value)

            // Só faz sentido para 'selection'
            if (options.type === 'selection') {

                // Se item é um objeto
                if (typeof item === 'object') {
                    // ... value será o value do item
                    value = item.value;

                // Se item não é objeto, mas o campo está preenchido
                } else if (fieldVal.length) {
                    
                    // Se o status é 'raw', coloca o prefixo correspondente.
                    if (status === 'raw') {
                        value = options.rawPrefix + fieldVal;
                    }
                    // Se não é 'raw', por eliminação será inválido; coloca o prefixo correspondente.
                    else {
                        value = options.invalidPrefix + fieldVal;
                    }

                // Se o item não é um objeto, e o campo não está preenchido
                } else {
                    // value assume valor vazio.
                    value = '';
                }
                // Expõe o value
                proxyHidden.val(value);
            }
        };

        // Essa função cuida basicamente de, dado o conjunto de opções e o valor do campo:
        // - Definir currentItem
        // - Definir o status do widget (entre normal e invalid)
        // - Mostrar o warning, se for o caso
        // - Expor o item encontrado (se o campo não estiver em foco)
        // - Mostrar o erro inline (se o campo já tiver tido foco antes e não estiver em foco)
        // 
        // Basicamente, essa função é chamada sempre que temos os dados (sejam todos eles, no
        // caso de client-side, seja uma parte, em caso de server-side), e um valor de campo,
        // e desejamos 'resolver' o valor, atualizando os valores e indicadores dependentes.
        var handleValue = function (result, value) {

            var hasError;

            // Tenta encontrar o item correspondente ao conteúdo do campo
            currentItem = mainMatch(result, value);
            // Há erro se o campo estiver preenchido e não houver um item correspondente.
            hasError = (value.length) && (!currentItem);
            // Se há erro, define status como 'invalid'
            status = hasError ? 'invalid' : 'normal';

            // Mostra ou esconde warning, de acordo com a condição de erro.
            setWarningIcon(hasError);

            // Se elemento não estiver com o foco no momento
            if (!element.is(":focus")) {

                exposeItem(currentItem);
                // Usamos o artifício de testar essa variável porque ela acaba testando também se 
                // o campo já esteve com foco alguma vez. Se o Plugin não foi iniciado, é porque
                // ele não recebeu foco, e se não recebeu foco, consideramos que se está tratando
                // do valor inicial do campo, ou seja, um campo que já iniciou preenchido na página.
                // Nesse caso específico, não é incluído o erro inline.
                if (autocompletePluginInitiated) {
                    // Verifica necessidade da apresentação da mensagem de erro;
                    setInlineError(hasError);
                }
            }
        };

        // A cada vez que o Plugin Autocomplete entende como necessário fazer uma busca
        // (isso quer dizer: o campo não está vazio e o keystroke delay foi cumprido)
        // essa função será chamada (evento search)
        // Se retornar 'false', a busca não será disparada.
        var isSearchNeeded = function () {

            var term = element.val().trim();

            // Não tentará fazer a busca se acontecer uma dessas condições
            // (desconsiderando espaços em branco no campo):
            // - o campo estiver vazio.
            // - currentItem existe e seu label é igual ao valor contido no campo.
            if (term.length === 0 || (currentItem && currentItem.label === term) ) {

                return false;
            }
            return true;
        };

        /* -----------------------------------------------------------------------------------------
         * Funções de inicialização
         */

        // Inicia o plugin utilizado de base para o Autocomplete
        var initAutocompletePlugin = function (source, keystrokeDelay) {
            
            var messages;

            // Valor padrão do keystrokeDelay = 0
            keystrokeDelay = (typeof keystrokeDelay === 'undefined') ? 0 : keystrokeDelay;

            // Há uma funcionalidade experimental no Plugin utilizado que permite modificar as
            // mensagens informadas para os leitores de tela. Aqui, usamos esse recurso
            // para poder traduzí-las.
            // Sendo experimental, isso pode precisar ser revisto especialmente se utilizarmos
            // uma nova versão desse Plugin.
            // http://stackoverflow.com/a/13014511
            messages = {
                noResults: "Nenhuma opção disponível para o texto informado.",
                results: function (amount) {
                    return amount + (amount > 1 ? " opções disponíveis" : " opção disponível") +
                        ", use as setas para cima e para baixo para navegar.";
                }
		    };

            // Criar instancia do Autocomplete com os parâmetros de configuração adequados
            element.autocomplete({
                source: source,
                minLength: MIN_LENGTH,
                appendTo: menuContainer,
                focus: onFocusItem,
                select: onSelectItem,
                open: onOpen,
                close: onClose,
                delay: keystrokeDelay,
                messages: messages,
                search: isSearchNeeded
            });

            // Ajusta atributos de acessibilidade no
            // elemento que contém a lista de opções (menu)
            element.autocomplete('widget').attr('role', 'listbox');

            // Indicação de que o Plugin foi instanciado.
            autocompletePluginInitiated = true;
        };

        // Função principal de inicialização
        var init = function () {

            // -- Teste de opções informadas --

            // Se invalidPrefix for um string vazio, isso pode dar problema
            if (!options.invalidPrefix.length) {
                console.warn(name, ': o valor informado para o parâmetro "invalidPrefix" é um string vazio. \n' +
                                   'Isso pode impedir a distinção entre valores válidos e inválidos. Recomenda-se manter o valor default ou informar um string não vazio.\n' +
                                   'Elemento: ', element);
            }
            // Se rawPrefix for um string vazio, isso pode dar problema
            if (!options.rawPrefix.length) {
                console.warn(name, ': o valor informado para o parâmetro "rawPrefix" é um string vazio. \n' +
                                   'Isso pode impedir a distinção entre valores tratados e não tratados. Recomenda-se manter o valor default ou informar um string não vazio.\n' +
                                   'Elemento: ', element);
            }
            //Verifica se o parâmetro requestHeaders é um Json válido
            if (options.requestHeaders) {
                try {
                    // Faz o parse do conteúdo obtido
                    options.requestHeaders = JSON.parse(JSON.stringify(options.requestHeaders));
                }
                // Caso aconteça algum erro no parser:
                catch (exception) {
                    // Força string vazia
                    options.requestHeaders =  Autocomplete.prototype.defaults.requestHeaders;
                    // Avisa sobre o erro ocorrido.
                    console.warn(name + ': O valor informado no parâmetro requestHeaders não é um JSON válido.\n',
                                'Será utilizado o valor default para esse parâmetro no elemento ', element);
                }
            } 

            // -- Cria elementos no DOM --

            // Cria o container com as classes necessárias para estilização dos ícones
            element.wrap("<div class=\"autocomplete icoAvisoAC\"></div>");

            // Cria o container para o menu do Plugin
            // @TODO Corrigir posição no DOM: para que venha antes do campo hidden (proxy)
            menuContainer = $('<div>').addClass('menu-container');
            menuContainer.insertAfter(element);

            // Atributos de acessibilidade sempre presentes em element
            element.attr({
                'role' : 'combobox',
                'aria-autocomplete' : 'list'
            });

            // Chama a função que faz a inserção do ícone de autocomplete
            // de acordo com o tipo (type) de autocomplete (suggestion ou selection)
            addAutocompleteIcon(options.type);

            // Chama função que faz a inserção do ícone de spinning para o autocomplete quando
            // os dados forem controlados pelo servidor;
            if (options.sourceType === 'serverControl') {
                addPendingIcon();
            }

            // Chama a função que adiciona o ícone invisível com o tooltip de alerta
            // para informar ao usuário a necessidade de inserir um caractere no campo
            addInvisibleIcon();

            // Para tipo 'selection'

            if (options.type === 'selection') {
                // Insere o campo hidden que servirá como 'proxy'
                addProxyHidden();
                // Adiciona o ícone de warning
                addWarningIcon();
                // Grava em element o valor de invalidPrefix utilizado, porque
                // ele precisa ser conhecido externamente para validação.
                element.data('picInvalidPrefix', options.invalidPrefix);
            }

            // -- Tratamento especial para selection que inicia preenchido --

            // Se o Autocomplete é do tipo 'selection' e o campo já iniciou preenchido,
            // é necessário obter os dados imediatamente
            if (options.type === 'selection' && element.val().trim().length > 0) {

                if (options.sourceType === "serverControl") {
                    // Indica que o conteúdo ainda não foi devidamente tratado
                    status = 'raw';
                    exposeItem(currentItem); // É esperado que, nesse ponto, seja undefined
                    // Dispara a requisição dos dados
                    rqPending(options.source, element.val())
                        .done(function (result) {
                            // Trata o valor inicial (quando os dados estiverem disponíveis)
                            handleValue(result, element.val());
                        });

                }
                else {
                    // Dispara a requisição dos dados
                    requestData(options.source, options.sourceType, function (result) {
                        // Trata o valor inicial (quando os dados estiverem disponíveis)
                        formatData(result);
                        handleValue(data, element.val());
                    });
                }
            }

            // -- Eventos --

            // Atenção para o fato de que 'focus' será executado apenas uma vez -- uso de .one()
            element.one('focus' + eventNamespace, onFirstFocus);

            // Tratamento de eventos necessários apenas para 'selection'
            if (options.type === 'selection') {

                element.on('blur' + eventNamespace, onBlur);
                element.on('keydown' + eventNamespace, onEnter);
                element.on('keyup' + eventNamespace, onArrowUpDown);

                if (options.sourceType === 'serverControl') {
                    element.on('textchange' + eventNamespace, onTextchangeSC);
                }
                else {
                    element.on('textchange' + eventNamespace, onTextchange);
                }
            }
        };

        /* -----------------------------------------------------------------------------------------
         * Eventos
         */

        // Executa todas as ações necessárias logo assim que os dados estejam disponíveis
        // Importante notar que essa função deve ser disparada no máximo uma vez durante o ciclo
        // de vida de cada instância do Autocomplete.
        var formatData = function (result) {
            // Disponibiliza os dados obtidos na variável de instância 'data'.
            data = result;
            // Se for um array de strings, transforma em um array de objetos.
            data = formatArray(data);

            // Cria label normalizado
            // - removendo espaços em branco
            // - removendo acentos de acordo com o valor de normalize
            // - colocando em caixa baixa de acordo com o valor de normalize
            data = createNormalizedLabel(data, true, normalize, normalize);

            // Indica que os dados estão prontos para uso.
            dataReady = true;
        };
        
        // Disparado quando um item da lista de resultados é selecionado
        var onSelectItem = function (event, ui) {

            // Expõe o item selecionado
            currentItem = ui.item;
            exposeItem(currentItem);

            if (options.type === 'selection') {
                // Oculta erro inline e warning, porque se um item da lista
                // foi selecionado, não tem como estar errado.
                setInlineError(false);
                setWarningIcon(false);
            }
            // Impede o comportamento padrão do Plugin
            return false;
        };

        // Disparado quando o foco é movido para um item da lista de resultados
        var onFocusItem = function (event, ui) {

            // Somente se o evento tiver sido disparado pelo teclado
            if (event.key) {
                // Expõe o item focado
                currentItem = ui.item;
                exposeItem(currentItem);

                if (options.type === 'selection') {
                    // Oculta erro inline e warning, porque se um item da lista
                    // foi selecionado, não tem como estar errado.
                    setInlineError(false);
                    setWarningIcon(false);
                }
                // Impede o comportamento padrão do Plugin
                return false;
            }
        };

        // Na abertura da lista de opções
        var onOpen = function (event, ui) {

            var menuWidth;

            // Controla atributos de acessibilidade
            element.attr('aria-expanded', 'true');
            menuContainer.find('li.ui-menu-item').attr('role', 'option');

            // Ajusta a largura do menu
            // Por algum motivo, o jQuery-UI deixa o menu 4px mais estreito que o input.
            // Como a largura do elemento é definido por script (css inline), a forma que
            // encontramos de resolver isso foi calcular e aplicar dinamicamente o ajuste.
            menuWidth = menuContainer.children().css('width');
            menuWidth = parseFloat(menuWidth) + 4;
            menuContainer.children('.ui-menu').css('width', menuWidth + 'px');
        };

        // No fechamento da lista de opções
        var onClose = function (event, ui) {

            var term = element.val();

            // Controla atributos de acessibilidade
            element.attr('aria-expanded', 'false');

            // @TODO Trecho replicado de onArrowUpDown -- melhorar
            if (term.length && options.type === 'selection') {

                if (options.sourceType === 'serverControl') {

                    rqPending(options.source, term)
                        // A requisição mais recente foi bem sucedida
                        .done(function (result) {
                            handleValue(result, term);
                        });
                }
                else {
                    handleValue(data, term);
                }
            }
        };

        // Realiza ações de verificação do valor inserido quando o element perde o foco
        // É necessário expor o item encontrado e
        // controlar a visibilidade dos elementos indicativos de erro.
        var onBlur = function (event) {

            var term = element.val(),
                hasError;
                
            // Se a busca tem quer feita no servidor
            if (options.sourceType === 'serverControl') {

                // A princípio, força a exposição do currentItem (ele existindo ou não)
                exposeItem(currentItem);

                // Se currentItem não está definido e o campo está preenchido
                if (!currentItem && term.length) {

                    rqPending(options.source, term)
                        // A requisição mais recente foi bem sucedida
                        .done(function (result) {
                            handleValue(result, term);
                        });
                }
                // Se o campo está vazio
                else {

                    setPendingIcon(false);
                    setWarningIcon(false);
                    setInlineError(false);
                }
            }
            else {

                // @TODO verificar possibilidade de chamar a função handleValue aqui
                //       substituindo esse trecho de código.
                if (!currentItem) {
                    currentItem = mainMatch(data, term);
                }

                exposeItem(currentItem);

                // Tem erro se: o campo está preenchido; e não corresponde a um item.
                hasError = (term !== '') && (!currentItem);
                setWarningIcon(hasError);
                setInlineError(hasError);
            }
        };
        
        // Realiza as ações necessárias na primeira vez em que o elemento recebe o foco
        var onFirstFocus = function (event) {
            
            // Para 'serverControl', apenas inicia o plugin.
            // Porque de duas, uma:
            // - Ou o campo iniciou vazio, e por isso não há termo de busca para solicitar os dados.
            // - Ou o campo iniciou preenchido, e nesse caso a primeira busca dos dados já foi feita.
            if (options.sourceType === 'serverControl') {
                
                initAutocompletePlugin(searchCallbackSC, 700);
            }
            // Para os demais casos
            else {
                // Se os dados já foram buscados, apenas inicia o plugin
                if (dataReady) {
                    
                    initAutocompletePlugin(searchCallback);
                }
                // Senão, solicita os dados, prepara e inicia o plugin
                else {
                    
                    requestData(options.source, options.sourceType, function (data) {
                        
                        formatData(data);
                        initAutocompletePlugin(searchCallback);
                    });
                }
            }
        };

        // Realiza as ações necessárias quando o usuário pressiona 'enter' estando
        // com o campo em foco (tipicamente, iniciando a submissão do form)
        var onEnter = function (event) {
            
            var term;

            // Quando o usuário pressiona enter, pode ser necessário ajustar
            // o valor do proxy
            if (event.which === key.enter) {

                term = element.val();
                
                if (options.sourceType === 'serverControl') {
                    // A princípio, força a exposição do currentItem (ele existindo ou não)
                    exposeItem(currentItem);
                    // Se currentItem não está definido e o campo está preenchido
                    if (!currentItem && term.length) {
                        // Solicita dados do servidor para expor o item
                        rqPending(options.source, term)
                            .done(function (result) {
                                currentItem = mainMatch(result, term);
                                exposeItem(currentItem);
                            });
                    }
                }
                else {

                    if (!currentItem) {
                        currentItem = mainMatch(data, term);
                    }
                    exposeItem(currentItem);
                }
            }
        };

        var onArrowUpDown = function (e) {

            var term;

            if (e.which === key.up || e.which === key.down || e.which === key.pageup || e.which === key.pagedown) {

                term = element.val();

                // O foco está no input de texto (não no menu de opções)
                if (menuContainer.has('.ui-state-focus').length === 0) {
                    // Se o campo estiver preenchido
                    // Para evitar, por exemplo, disparar uma busca se o usuário colocar o foco
                    // em um campo vazio e apertar as setas para cima ou para baixo.
                    if (term.length) {

                        if (options.sourceType === 'serverControl') {

                            rqPending(options.source, term)
                                // A requisição mais recente foi bem sucedida
                                .done(function (result) {
                                    handleValue(result, term);
                                });
                        }
                        else {
                            handleValue(data, term);
                        }
                    }
                }
            }
        };

        // Quando o valor do campo é modificado
        // (apenas para serverControl)
        var onTextchangeSC = function (event) {
            
            currentItem = undefined;

            if (element.val().length) {
                // Para indicar que o valor informado (modificado) ainda não foi tratado.
                status = 'raw';
            } 
            else {
                // Deixa como 'normal' se o campo estiver vazio
                status = 'normal';
                setWarningIcon(false);
            }
        };

        // Quando o valor do campo é modificado
        // (quando nõa é serverControl)
        var onTextchange = function (event) {

            handleValue(data, element.val());
        };

        /* -----------------------------------------------------------------------------------------
         * Inicialização
         */
        init();

        // Expondo os métodos públicos
        api = {
            destroy: destroy
        };
        $.extend(this, api);

    };

    Autocomplete.prototype = {
        name: 'Autocomplete',

        defaults: {
            type: 'suggestion',
            sourceType: 'uri',
            invalidPrefix: 'invalid::',
            rawPrefix: 'raw::',
            requestHeaders: ''
        },

        domains: {
            type: ['suggestion', 'selection'],
            sourceType: ['uri', 'hidden', 'serverControl']
        }
    };

    /*
     * Solicita o registro do widget
     */
    PIC.widgetRegister(Autocomplete);

})(jQuery, window, document);

})();
/* Início de novo arquivo concatenado */
(function () {/* Datepicker */
/**
Cria calendário junto ao input.

Nota: Todos os strings de data que são passados por parâmetro devem estar no formado `"DD/MM/YYYY"`

@module Datepicker
@attribute data-pic-datepicker
@param {string} [rangeLow] - Quando informado, datas anteriores a essa não poderão ser selecionadas.
                             Pode-se usar o valor `today` para impedir a seleção de datas passadas.
@param {string} [rangeHigh] - Quando informado, datas posteriores a essa não poderão ser selecionadas.
                              Pode-se usar o valor `today` para impedir a seleção de datas futuras.
@param {array} [disableDays] - Define quais dias da semana estarão desabilitados para seleção.
                                Cada posição do array representa um dia da semana, começando por domingo.
                                Para desabilitar sábados e domingos, por exemplo, use: `[1,0,0,0,0,0,1]`.
                                Por padrão, todos os dias estão habilitados.
@param {string | array} [disableDates] - Define datas específicas que estarão desabilitadas. Se for um string, define a data desabilitada.
                                 Se for um array, cada posição do array deve conter:
                                 um string representando uma data a ser desabilitada (nesse caso, pode-se usar `*` para generalizar, como "01/01/****" para representar esse dia e mês em qualquer ano)
                                 ou um array com duas posições, representando o início e o final de um período a ser desabilitado.
@param {string} [type=default] - Define a forma de exibição do calendário: default|inline. Use `inline` para ter o calendário sempre aberto, junto ao input.
@example
<!-- Datepicker básico -->
<input data-pic-datepicker type="text" id="dataExemplo" class="form-control">

<!-- Datepicker definindo limite inferior, dias da semana desabilitados, data, padrão de data e intervalo de datas desabilitados -->
<input data-pic-datepicker='{"rangeLow": "28/10/2015", "disableDays": [1,0,0,0,0,0,1], "disableDates": ["30/10/2015", "01/01/****", ["24/12/2015", "03/01/2016"]]}' type="text" id="dataIni" name="dataIni" class="form-control">

*/

;(function ($, window, document, undefined) {

    'use strict';
    
    /*
     * Variáveis globais
     * no escopo da closure
     */
    var TODAY = 'today';

    /*
     * Executa apenas uma vez, na carga da página
     */
    // Opções globais do datepicker (valem para todas as instâncias)
    datePickerController.setGlobalOptions({
        titleformat: "%j de %F de %Y",
        statusFormat: '%l, %d/%m/%Y',
		nodrag: 1
    });

    /*
     * Definição da classe
     */
    var Datepicker = function (widgetHelper) {

        /*
         * Variáveis de instância
         * Defina todas aqui antes de usar
         */
        var name = this.name,
            element = widgetHelper.element,
            options = widgetHelper.options,
            eventNamespace = widgetHelper.eventNamespace,
            elementId,
            opts;

        /*
         * Métodos públicos
         */
        this.destroy = function () {
            
            // Se o element não possui id, nada foi feito na inicialização.
            // Por isso, só executa algo aqui se houver id.
            if (elementId) {
                
                // Remove classe inserida para estrutura '.input-group'
                element.next('.date-picker-control').removeClass('input-group-addon');
                
                // Destrói o datepicker original
                datePickerController.destroyDatePicker(elementId);
                // @TODO remover listener do evento 'change' 
                // O que acontece?
                // 1. O DatePicker original registra um listener para o evento 'change', como o parâmetro useCapture=true;
                //    entretanto, ele não remove esse listener no método destroyDatePicker().
                // 2. Com useCapture=true, não é possível usar o .off() do jQuery
                // 3. Para deixar de lado o jQuery e usar o removeEventListener (do DOM), é preciso passar,
                //    além do element e do nome do evento a remover, a referência ao listener. Essa referência
                //    é o problema: embora saibamos qual é a função (é a changeHandler do objeto datePicker),
                //    não temos acesso a essa referência  a partir daqui.
                // Com isso, o destroy não está sendo completamente feito, restando esse listener ligado ao final.
                
                // Remove classe e div.input-group
                element
                    .removeClass('datePicker')
                    .unwrap();
            }
        };
        
        
        /*
         * Métodos privados
         */

		// Reposiciona o nó do popup calendário no DOM, se estiver dentro de uma modal
		var manageCloseEvents = function(obj) {

			/*
			 * Aqui já ocorreu o evento de acionamento do botão que dispara a exibição do 
			 * calendário: click ou keydown
			 */
			var currentModal = element.closest("[data-pic-modal][data-pic-active]"),
				botao = currentModal.find("#fd-but-"+obj.id),
				calendario = $("#fd-"+obj.id);
			
			if (currentModal.length) {
				currentModal.append(calendario.remove());
				
				currentModal.children().first().keydown( function(e) {
					if (e.which === 27 && calendario.attr('aria-hidden') === 'false') {
						e.stopPropagation();
						if ( ! calendario.hasClass('data-picker-focus') ) {
							botao.click();
						}
						return false;
					} 
				});
			}
			
		};
		
        // Recebe uma data no formato DD/MM/YYYY e retorna no formato YYYYMMDD.
        var invertDate = function (date) {
            var jsonString = JSON.stringify(date);
                jsonString = jsonString.replace(/[{}"]/g, '');

            var pieces = jsonString.split('/');
            pieces.reverse();
            var reversed = pieces.join('');

            return reversed;
        };

        // Transforma o parâmetro disableDays para o formato esperado pelo datepicker original.
        var fixdisableDays = function () {

            var domingo;

            // Se disableDays for um array (o que é esperado),
            // Tira o primeiro elemento (domingo) e coloca no final.
            // Porque o datepicker original espera que domingo seja o último, e não o primeiro.
            if ($.isArray(options.disableDays) && (options.disableDays.length)) {
                domingo = options.disableDays.shift();
                options.disableDays.push(domingo);
            }
        };

        // Transforma o parâmetro disableDates para o formato esperado pelo datepicker original.
        var fixdisableDates = function () {

            var disableDates = [];

            if ($.isArray(options.disableDates) && (options.disableDates.length)) {

                // options.disableDates chega no formato de array, em que cada posição pode ser uma
                // data, ou um array com duas datas (inicial e final). Datas no formato DD/MM/YYYY.
                // Entretanto, o datepicker original recebe esse parâmetro de forma bem diferente,
                // como documentado em: http://freqdec.github.io/datePicker/#disabling-date-selection
                // Esse trecho de código é responsável pela transformação necessária
                $.each (options.disableDates, function (index, value) {

                    // Se esse valor é um array, entende-se como período [início, fim]
                    if ($.isArray(value)) {
                        // Transforma ["01/01/2000", "02/01/2000"] em { "20000101" : "20000102"}
                        disableDates[invertDate(value[0])] = invertDate(value[1]);

                    } else {
                        // Transforma "01/01/2000" em { "20000101" : 1}
                        disableDates[invertDate(value)] = 1;
                    }
                });
                options.disableDates = disableDates;
            }
            else if (typeof options.disableDates == 'string' && options.disableDates.length) {
                // options.disableDates chega no formato de string
                // Transforma "01/01/2000" em { "20000101" : 1}
                disableDates[invertDate(options.disableDates)] = 1;
                options.disableDates = disableDates;
            }
            
        };

        // Trata os parâmetros de range (rangeHigh ou rangeLow)
        var manageRangeLimit = function(range) {
                var formatedRange;
                // Checa por valor dinâmico
                if (range == TODAY) {
                    formatedRange = invertDate(new moment().format('DD/MM/YYYY'));
                } else {
                    formatedRange = invertDate(range);
                }

                return formatedRange;
        };

        /*
         * Implementação do plugin (o que o plugin faz ou estende ao comportamento de outro)
         */

        // O id do elemento onde será instanciado o datepicker
        elementId = element.attr("id");

        if (elementId) {

            // Adiciona classe necessária para transformação
            // e encapsula para usar a estrutura '.input-group' do Bootstrap como forma de
            // posicionar o calendário (ícone).
            element
                .addClass("datePicker")
                .wrap('<div class="input-group"></div>');

            // opts armazena os parâmetros de configuração dessa instância do datepicker
            opts = {
                formElements : {},
                highlightDays: [0,0,0,0,0,1,1], // S,T,Q,Q,S,S,D
                noFadeEffect: true,
				callbackFunctions:{
        			"domcreate":[manageCloseEvents]
				}
            };

            opts.formElements[elementId] = '%d/%m/%Y';

            // Adiciona limite inferior
            if (options.rangeLow) {
                opts.rangeLow = manageRangeLimit(options.rangeLow);
            }

            // Adiciona limite superior
            if (options.rangeHigh) {
                opts.rangeHigh = manageRangeLimit(options.rangeHigh);
            }

            // Define se será exibido da forma 'default' (false) ou 'inline' (true)
            opts.staticPos = (options.type === 'default' ? false : true );

            // Define dias (da semana) que estarão desabilitados
            if (options.disableDays) {
                fixdisableDays();
                opts.disabledDays = options.disableDays;
            }

            // Instancia o datepicker original com as opções correspondentes.
            datePickerController.createDatePicker(opts);

            // Define datas que estarão desabilitadas
            if (options.disableDates) {
                fixdisableDates();
                datePickerController.setDisabledDates(elementId, options.disableDates);
            }

            // Adiciona classe necessária para estrutura '.input-group'
            element.next('.date-picker-control').addClass('input-group-addon');
			
			if (element.attr('type') === 'text') {
				element.on('keydown'+widgetHelper.eventNamespace, function (e) {
					PIC.Mask.applyMask($(this),'00/00/0000');
				});
			}else {
				// Se o atributo type for date pode haver problemas de compatibilidade com navegadores
				console.warn('Datepicker pode apresentar problemas de compatibilidade com campos de entrada do tipo Date - especialmente no Google Chrome. ', element);
			}

        } else {
			// Se o id do element não está definido, não é possível instanciar
            console.warn('Datepicker não pode ser iniciado se o atributo "id" do input não for definido. ', element);
        }
    };
    
    Datepicker.prototype = {
        
        name: 'Datepicker',
        
        defaults: {
            rangeLow: '',
            rangeHigh: '',
            type: 'default',
            disableDays: '',
            disableDates: ''
        },

        domains: {
            type: ['default', 'inline']
        }
    };

    /*
     * Solicita o registro do widget
     */
   PIC.widgetRegister(Datepicker);

})(jQuery, window, document);
})();
/* Início de novo arquivo concatenado */
(function () {/* Actionsbar */
/**
Transforma uma lista de links (ações) em um botão que, ao ser acionado, mostra essas ações.

A forma de exibição é controlada pelo parâmetro `type` e pode ser uma barra horizontal (bar) ou um dropdown. Os botões podem ter aparência de ações primárias ou secundárias, assim como os demais botões de ação no PIC

@complement Configuração_interna

- `primary|secondary`:
  Somente para listas de ações do tipo 'bar'. Usado para redefinir a aparência de um botão específico como primário ou secundário. Use para destacar ou atenuar a chamada para ação no conjunto de ações. Aplique à tag &lt;a&gt; dentro do item de lista

@module Actionsbar
@attribute data-pic-actionsbar
@param {string} [type=bar] - Controla a aparência da lista de ações. Valores possíveis: bar|dropdown
@param {string} [label] - Insere rótulo no botão acionador do Actionsbar.
@param {string} [buttonType=primary] - Define se o aspecto do trigger e botões de ação será de botão/ação primário ou secundário.  Valores possíveis: primary|secondary
@example
<ul data-pic-actionsbar>
    <li><a href="/sistema/acao1.do">Ação 1</a></li>
    <li><a href="/sistema/acao2.do">Ação 2</a></li>
    <li><a href="/sistema/acao3.do">Ação 3</a></li>
</ul>
*/
;(function ($, window, document, undefined) {

    'use strict';

    /*
     * Definição da classe
     */
    var Actionsbar = function (widgetHelper) {

        /*
         * Variáveis de instância
         * Defina todas aqui antes de usar
         */
        var name = this.name,
            element = widgetHelper.element,
            options = widgetHelper.options,
            eventNamespace = widgetHelper.eventNamespace,
            acionador,
            actionItens,
            widthBarraAcoes,
            doneAtXS;

        /*
         * Métodos públicos
         */

        // Destrói uma instância de Actionsbar, buscando retornar o código html ao seu original.
        this.destroy = function () {

            widgetHelper.clearEvents();

            element.prev().remove();
            element.closest('.actionsContext').removeClass("active").removeClass('actionsContext');
            element.unwrap('.barra-de-acoes');
            element.removeAttr('class style tabindex role aria-expanded aria-activedescendant aria-hidden');
            element.children().each(function () {
                $(this).removeAttr("id role tabindex");
                $(this).children().removeAttr("class data-placement");
            });
        };

        /*
         * Métodos privados
         */

        var windowResizeHandler = function (e) {

            // Se a tela for estreita (XS)...
            if (PIC.isXS($(window).width())) {
                // ... e o Actionsbar não tiver sido ativado nesse tipo de tela.
                if (!doneAtXS) {
                    // Ativa novamente o Actionsbar e marca que foi feito em tela estreita.
                    PIC.refreshWidget(name, element);
                    doneAtXS = true;
                }

            // Se a tela não for estreita (XS)...
            } else {
                // ... e o Actionsbar tiver sido ativado nesse tipo de tela.
                if (doneAtXS) {
                    // Ativa novamente o Actionsbar e marca que não foi feito em tela estreita.
                    PIC.refreshWidget(name, element);
                    doneAtXS = false;
                }
            }
        };

        // Abre a barra de ações (animadamente!)
        var openBar = function (acionador) {

            // Ao abrir a barra, mesmo que a abertura tenha sido promovida pelo teclado,
            // simula um click no document (como se o acionador tivesse sido clicado)
            // Isso fará com que outras barras eventualmente abertas sejam fechadas
            $(document).trigger($.Event('click', {target:acionador}));

            acionador.next().attr({
                "aria-expanded": "true",
                "aria-hidden": "false"
            });

            // @TODO revisar a linha a seguir
            // O fato é que: acionador.parent().parent().parent() alcança a 'tr' onde o actionsBar está contido
            // Isso foi feito para funcionar especificamente dentro de uma tabela, e será preciso dar uma solução mais genérica
            // O seletor 'tr' no último parent já foi adicionado como tentativa de dar uma solução mais genérica,
            // fazendo com que a classe seja aplicada somente se o contexto de uso for o esperado originalmente.
            acionador.closest('.actionsContext').addClass("active");

            acionador.children().removeClass("glyphicon-eye-open");
            acionador.children().addClass("glyphicon-eye-close");
            acionador.next().css("display", "block");

            // Registra listener no document
            $(document).on('click' + eventNamespace, {'acionador': acionador}, closeMe);

			acionador.parent().finish().animate({
                marginLeft: widthBarraAcoes * -1
            }, 200 );

            acionador.next().finish().animate({
                marginRight: 4,
                opacity: 1
            }, 200 );

			// Restaura a aparência original do botão
			acionador.next().find('.btn-acao>*').css({'width':'','border':'',padding:''});

            acionador.removeClass("fechado");

        };

        // Fecha a barra de ações indicada no evento.
        //Rotina para fechar barra de ações quando existir click fora da barra de ações
        var closeMe = function (e) {

            // Se o elemento acionado (target) não faz parte do acionador,
            // e nem é o próprio acionador
            if (acionador.has(e.target).length === 0 && !acionador.is(e.target)) {

                if (e.data.acionador.hasClass("fechado") === false) {
                    closeBar(e.data.acionador);
                }
            }
        };

        // Fecha a barra de ações (animadamente!)
        var closeBar = function (acionador) {

            acionador.next().attr({
                "aria-expanded": "false",
                "aria-hidden": "true",
                "aria-activedescendant": ''
            });

            actionItens.children().attr('tabindex', '-1');

            // @TODO revisar a linha a seguir
            // Ver o que foi documentado acima, para o addClass correspondente
            acionador.closest('.actionsContext').removeClass("active");

            acionador.children().removeClass("glyphicon-eye-close");
            acionador.children().addClass("glyphicon-eye-open");

            // Remove listener do document
            $(document).off('click' + eventNamespace);

            acionador.parent().finish().animate({
                marginLeft: 0
            }, 200 );

			//Anima o fechamento da barra de ações, concluindo com dimesões zero para evitar deslocamento na recuperação do foco
            acionador.next().finish().animate({
                marginRight: widthBarraAcoes * -1,
                opacity: 0,
            }, 200, function() {
				$(this).find('.btn-acao>*').css({'width':'0', 'padding':'0','border':'none'});
			} );

            acionador.addClass('fechado');
        };

        // Alterna a visibilidade da barra de ações
        var toggleBar = function (acionador) {
            // Se a barra estiver fechada, abre
            if (acionador.hasClass('fechado')) {
                openBar(acionador);
            // Se a barra estiver aberta, fecha
            } else {
                closeBar(acionador);
            }
        };

        // Clique no acionador da barra
        // Alterna a visibilidade da barra e define o foco em uma ação da lista
        var clickAcionadorBar = function (e) {
            toggleBar($(this));
            e.preventDefault();
            // e.stopPropagation();
        };

        // Keydown no acionador da barra
        var keydownAcionadorBar = function (e) {

            // Se estiver fechada
            if ($(this).hasClass('fechado')) {

                switch (e.which) {

                    case key.up:

                        // Abre a barra e define o foco na última opção.
                        openBar($(this));
                        actionItens.parent().attr("aria-activedescendant", actionItens.last().attr("id"));
                        actionItens.last().children()
                            .attr("tabindex", "0")
                            .focus();

                        e.preventDefault();
                        break;

                    case key.down:
                    case key.enter:

                        // Abre a barra e define o foco na primeira opção.
                        openBar($(this));
                        actionItens.parent().attr("aria-activedescendant", actionItens.first().attr("id"));
                        actionItens.first().children()
                            .attr("tabindex", "0")
                            .focus();

                        e.preventDefault();
                        break;
                }

            // Se estiver aberto
            } else {

                switch (e.which) {

                    case key.up:
                    case key.left:

                        // Define o foco na primeira opção
                        actionItens.parent().attr("aria-activedescendant", actionItens.last().attr("id"));
                        actionItens.last().children()
                            .attr("tabindex", "0")
                            .focus();

                        e.preventDefault();
                        break;

                    case key.down:
                    case key.right:

                        // Define o foco na última opção
                        actionItens.parent().attr("aria-activedescendant", actionItens.first().attr("id"));
                        actionItens.first().children()
                            .attr("tabindex", "0")
                            .focus();

                        e.preventDefault();
                        break;

                    case key.esc:

                        // Apenas fecha a barra
                        closeBar($(this));
                        e.preventDefault();
                        e.stopPropagation();
                        break;
                }
            }
        };

        // Keydown em um item de ação da barra
        // Controla a ação em foco e permite o fechamento da lista de ações
        var keydownItemBar = function (e) {

            var $this = $(this),
                currentItem = $this;

            switch(e.which) {

                case key.right:
                case key.down:

                    $this.children().attr("tabindex", "-1");

                    // O próximo (se houver), ou o primeiro da lista
                    currentItem = $this.next().length ? $this.next() : actionItens.first();

                    $this.parent().attr("aria-activedescendant", currentItem.attr("id"));

                    currentItem.children()
                        .attr("tabindex", "0")
                        .focus();

                    e.preventDefault();
                    break;

                case key.left:
                case key.up:

                    $this.children().attr("tabindex", "-1");

                    // O anterior (se houver), ou o último da lista
                    currentItem = $this.prev().length ? $this.prev() : actionItens.last();

                    $this.parent().attr("aria-activedescendant", currentItem.attr("id"));

                    currentItem.children()
                        .attr("tabindex", "0")
                        .focus();

                    e.preventDefault();
                    break;

                case key.esc:
                    closeBar(e.data.acionador);
                    e.data.acionador.focus();
                    e.stopPropagation();
                    break;
            }

        };
        
        // Focusin em um item de ação da barra
        // Força o foco no acionador se a barra estiver fechada.
        var focusinItemBar = function (e) {
            if (e.data.acionador.hasClass('fechado')) {
                e.data.acionador.focus();
            }
        };
        

        // Keydown no acionador do dropdown
        // Alterna a visibilidade do dropdown e define o foco em uma ação da lista.
        var keydownAcionadorDropdown = function (e) {
            $(this).next().children().removeClass("active");
            $(this).next().children().children().attr("tabindex", "-1");
            if (e.which === key.up) {
                $(this).trigger('click.bs.dropdown');
                $(this).next().children().last().children().focus();
                $(this).next().children().last().addClass("active");
                $(this).next().children().last().children().attr("tabindex", "0");
                e.stopPropagation();
            } else if (e.which === key.down) {
                $(this).trigger('click.bs.dropdown');
                $(this).next().children().first().children().focus();
                $(this).next().children().first().addClass("active");
                $(this).next().children().first().children().attr("tabindex", "0");
            } else if (e.which === key.enter) {
                $(this).trigger('click.bs.dropdown');
                $(this).next().children().first().children().focus();
                $(this).next().children().first().addClass("active");
                $(this).next().children().first().children().attr("tabindex", "0");
            }
            $(this).children().removeClass("active");
        };

        // Keydown em um item de ação do dropdown
        // Controla a ação em foco e permite o fechamento da lista de ações.
        var keydownItemDropdown = function (e) {
            if (e.which === key.down || e.which === key.right) {
                if ($(this).next().index() >= 0) {
                    $(this).removeClass("active");
                    $(this).children().attr("tabindex", "-1");
                    $(this).next().children().focus();
                    $(this).next().addClass("active");
                    $(this).next().children().attr("tabindex", "0");
                    $(this).parent().attr("aria-activedescendant", $(this).next().attr("id"));
                }else{
                    $(this).parent().children().first().children().focus();
                    $(this).parent().children().last().removeClass("active");
                    $(this).parent().children().last().children().attr("tabindex", "-1");
                    $(this).parent().children().first().addClass("active");
                    $(this).parent().children().first().children().attr("tabindex", "0");
                    $(this).parent().attr("aria-activedescendant", $(this).parent().children().first().attr("id"));
                }
                e.stopPropagation();
                e.preventDefault();
            } else if (e.which === key.up || e.which === key.left) {
                if ($(this).prev().index() >= 0){
                    $(this).removeClass("active");
                    $(this).children().attr("tabindex", "-1");
                    $(this).prev().children().focus();
                    $(this).prev().addClass("active");
                    $(this).prev().children().attr("tabindex", "0");
                    $(this).parent().attr("aria-activedescendant", $(this).attr("id"));
                }else{
                    $(this).parent().children().last().children().focus();
                    $(this).parent().children().first().removeClass("active");
                    $(this).parent().children().first().children().attr("tabindex", "-1");
                    $(this).parent().children().last().addClass("active");
                    $(this).parent().children().last().children().attr("tabindex", "0");
                    $(this).parent().attr("aria-activedescendant", $(this).parent().children().last().attr("id"));
                }
                e.stopPropagation();
                e.preventDefault();
            } else if (e.which === key.esc) {
                $(this).parent().parent().removeClass("open");
                $(this).parent().prev().focus();
                $(this).removeClass("active");
            }
        };


        // Controla o que é feito quando o dropdown é exibido
        var shownDropdown = function () {

            // Se o dropdown não cabe para baixo
            if (!widgetHelper.fitDown()) {

                element.parent().addClass('dropup');
            }
			//Se for uma tela pequena - onde uma lista de ações e apresentada em forma de caixa -
			// verificar se o elemento que traz o rótulo da ação cabe na caixa e redimensionar a fonte
			
			if(PIC.isXS($(window).width())) {
            	element.find("[role=menuitem]>a").each( function() {
					var fonteAplicada = 100,
						textContainer = $(this),
						theText;
					theText = textContainer.children(".the-text").length ? textContainer : textContainer.wrapInner("<div class='the-text'><span></span></div>");
					theText = theText.find(".the-text>span");

					while (theText.actual("width") > textContainer.actual("width")) {
						fonteAplicada = fonteAplicada - 1;
						if(fonteAplicada < 70) {
							textContainer.css("font-size", "");
							break;
						}
						textContainer.css("font-size", fonteAplicada + "%");
					}
				});
			}
			
			//força a aparência primária das ações sempre que forem exibidas em telas pequenas
			if (PIC.isXS($(window).width()) && !element.prev(".extra-element").length) {
				element.before("<span class='extra-element btn-primary'></div>");
			}
        };

        // Controla o que é feito quando o dropdown é exibido
        var hiddenDropdown = function () {

            // Remove a indicação de que o menu deve ser aberto "para cima",
            // já que essa necessidade será testada a cada abertura do dropdown.
            element.parent().removeClass('dropup');
			
			//Limpa a marcação que força a transformação de ações em primárias em telas pequenas
			element.prev(".extra-element").remove();
        };

        /*
         * Implementação do plugin
         */

        // Indica se inicialmente (ao ativar o widget) estava em uma tela estreita (XS).
        doneAtXS = PIC.isXS($(window).width());
		
		var buttonType = "btn-" + options.buttonType;

        // Barra (a opção 'bar' não vale para telas XS)
        if (options.type === "bar" && !PIC.isXS($(window).width()) ) {

            if (element.parent().is("td")) {
                element.parent().addClass("clearfix");
				element.closest('tr').addClass('actionsContext');
                widthBarraAcoes = element.parent().parent().actual("width");

            } else if (element.parent().is(".list-group-item")) {
                element.parent().addClass("clearfix");
				element.parent().addClass('actionsContext');				
                widthBarraAcoes = element.parent().actual("width");

            } else {
                widthBarraAcoes = element.parent().actual("width")  ;
            }

            element.wrap('<div class="barra-de-acoes acoes" role="menubar"></div>');
            element.addClass("lista-de-acoes");
            element.attr({
                'role': 'menu',
                'aria-expanded': 'false',
                'aria-hidden': 'true'
            });
            element.css("margin-right", widthBarraAcoes * -1);

            // Para cada 'li', ou seja, cada opção dentro do actionsBar
            element.children()
                .addClass('btn-acao')
                .attr({
                    'role': 'menuitem',
                })
                .after(' ')
                .uniqueId();

            // Para cada filho de cada 'li' - botões/opções do grupo
			var appliedButton;
			var itemAcao;
            element.find('.btn-acao').each( function() {
				appliedButton = "btn-primary";
				itemAcao = $(this).children().last();
				var thisButtonConfig = itemAcao.attr("data-pic-actionsbar-config");
				if (["primary","secondary"].indexOf(thisButtonConfig)!==-1) {
					appliedButton = "btn-" + thisButtonConfig;
				}
                itemAcao.addClass('btn ' + appliedButton)
                	.attr({
                    	'tabindex': '-1'
                	});
			});

            element.parent().prepend("<a aria-haspopup=\"true\" class=\"btn " + buttonType + " btn-ativar-lista-acoes fechado\" title=\"Abrir barra de ações\" tabindex=\"0\">"+
                                    "<span class=\"glyphicon glyphicon-eye-open\"></span> "+options.label+"</a>");

            acionador = element.parent().children(".btn-ativar-lista-acoes");

            element.parent().children(".btn-ativar-lista-acoes").uniqueId();

            // Click no acionador da barra
            element.parent().children('.btn-ativar-lista-acoes').on('click' + eventNamespace, clickAcionadorBar);

            // Tecla pressionada no acionador da barra
            element.parent().children('.btn-ativar-lista-acoes').on('keydown' + eventNamespace, keydownAcionadorBar);

            actionItens = element.children('li');

            // Tecla pressionada em um item da lista de ações.
            actionItens.on('keydown' + eventNamespace, {'acionador': acionador}, keydownItemBar);
            
            // Foco em um item (ou elemento interno) da lista de ações.
            actionItens.on('focusin' + eventNamespace, {'acionador': acionador}, focusinItemBar);

        } else {
			// Dropdown ou telas pequenas
            if(element.parent().is("td")){
                element.parent().addClass("clearfix");
            }else if(element.parent().is(".list-group-item")){
                element.parent().addClass("clearfix");
            }

            element.wrap('<div class="barra-de-acoes btn-group" role="menubar"></div>');
            element.parent().css("float", "right");
            element.addClass("dropdown-menu dropdown-menu-right");
            element.attr({
                'role': 'menu',
                'aria-expanded': 'false'
            });

            // Para cada 'li', ou seja, cada opção dentro do actionsBar
            element.children()
                .addClass("btn-acao")
                .attr({
                    'role': 'menuitem'
                })
                .uniqueId()
                .children().attr({
                    'tabindex': '-1'
                });

            // Para cada filho de cada 'li'
            element.children().children().removeAttr("class");

            // Utiliza o valor do primeiro item da lista (primeira ação) como valor para aria-activedescendant
            element.attr('aria-activedescendant', element.children().first().attr('id'));
            element.parent().prepend("<a tabindex=\"0\" title=\"Abrir lista de ações\" class=\"btn " + buttonType + " dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\">"+
                                    "<span class=\"glyphicon glyphicon-th-list\"></span> "+options.label+"</a>");

            //var widthStartBrn = element.parent().actual("outerWidth");
            //element.css("margin-right", widthStartBrn);
			
            // Keydown no acionador do dropdown e em item da lista de ações.
            element.parent()
                .on('keydown' + eventNamespace, '.dropdown-toggle', keydownAcionadorDropdown)
                .on('keydown' + eventNamespace, '.dropdown-menu li', keydownItemDropdown);

            element.parent()
                .on('click' + eventNamespace, '.dropdown-toggle', keydownAcionadorDropdown);

            element.parent()
                .on('shown.bs.dropdown' + eventNamespace, shownDropdown)
                .on('hidden.bs.dropdown' + eventNamespace, hiddenDropdown);

        }

        if (options.type === 'bar') {
            // Quando a tela muda de tamanho, actionsbar do tipo 'bar' precisam ser tratados.
            $(window).on('resize' + eventNamespace, windowResizeHandler);
        }
    };

    Actionsbar.prototype = {

        name: 'Actionsbar',

        defaults: {
            type: 'bar',
            label: '',
			buttonType: 'primary'
        },

        domains: {
            type: ['bar', 'dropdown'],
			buttonType: ['primary', 'secondary']
        }
    };

    /*
     * Solicita o registro do plugin
     */
    PIC.widgetRegister (Actionsbar);

})(jQuery, window, document);

})();
/* Início de novo arquivo concatenado */
(function () {/* Globalnav */
/**
Transforma uma lista (em um ou dois níveis) no menu global do seu sistema.

Use `data-pic-state-current` no item de menu (`li`) que representa a página atual, seja um item
de primeiro nível (que não seja um agrupador) ou segundo nível. *O uso desse atributo em um item
agrupador é inválido*.

@module Globalnav
@attribute data-pic-globalnav
@example
<ul data-pic-globalnav>
    <li>
        <a href="#">Funcionalidades do grupo A</a>
        <ul>
            <li data-pic-state-current><a href="#">Funcionalidade A1</a></li>
            <li><a href="#">Funcionalidade A2</a></li>
        </ul>
    </li>
    <li>
        <a href="#">Funcionalidades do grupo B</a>
        <ul>
            <li><a href="#">Funcionalidade B1</a></li>
            <li><a href="#">Funcionalidade B2</a></li>
        </ul>
    </li>
    <li>
        <a href="#">Funcionalidade C</a>
    </li>
</ul>
*/
;(function ($, window, document, undefined) {

    'use strict';

    /*
     * Definição da classe
     */
    var Globalnav = function (widgetHelper) {

        /*
         * Variáveis de instância
         */
        var name = this.name,
            element = widgetHelper.element,
            options = widgetHelper.options,
            eventNamespace = widgetHelper.eventNamespace,
            group;

        /*
         * Métodos públicos
         */

        /**
         * Seta o item (`li`) informado como o item corrente (ativo) do menu.
         *
         * Se for informado um item de segundo nível, o primeiro nível é tratado automaticamente.
         *
         * @method setCurrent
         * @param li {mixed} - Item a ser marcado como o corrente. Pode ser informado como um seletor, um elemento ou um objeto jQuery.
         * @returns {boolean} Indica se foi possível (true) ou não (false) setar o item informado como o corrente.
         * @instance
         */
        this.setCurrent = function (item) {

            // Garante que o item seja um objeto jQuery, e apenas um.
            item = element.find(item).filter('li').first();

            // Se o item existe e não possui subitens
            if (item.length && item.has('ul').length === 0) {

                // Remove a classe active de qualquer 'li' que a possua
                element.find('li.active').removeClass('active');
                // Insere a classe 'active' no item encontrado.
                item.addClass('active');
                // Se a marca não está num item de primeiro nível (deve estar num de segundo)
                if (!item.closest('ul').is(element)) {
                    // Marca o pai também como active
                    item.parent().closest('li').addClass('active');
                }
                return true;
            }
            return false;
        };

        this.destroy = function () {

            // Desligando eventos
            widgetHelper.clearEvents();

            // Remove o botão de acionamento em telas pequenas
            element.closest('#banner').find('.menuPrimario').remove();

            // Tentando voltar os tabindex ao padrão
            element.find('li').removeAttr('tabindex');
            element.find('li > a').removeAttr('tabindex');

            // Removendo classe 'active', inserida por setCurrent
            element.find('active').removeClass('active');

            // @TODO Em tese, deveríamos remover (destroy) do Dropdown Hover aqui. Como fazer?

            element.closest('nav').removeAttr('aria-label');

            element.find('li').removeUniqueId();

            group.find('ul')
                .removeClass('dropdown-menu')
                .removeAttr('role aria-hidden');

            group.children('a')
                .removeClass('dropdown-toggle')
                .removeAttr('data-hover data-toggle data-delay role aria-expanded');

            group
                .removeClass('dropdown groupMenu')
                .removeAttr('aria-haspopup');

            // Removendo marca de item de menu
            element.find('li').removeAttr('role');

            element
                .removeClass('nav navbar-nav')
                .removeAttr('role');

            // Removendo div#menubar
            element.unwrap();
        };

        /*
         * Métodos privados
         */

        /*
         * Implementação do plugin (o que o plugin faz ou estende ao comportamento de outro)
         */

        element.wrap('<div id="menubar" class="collapse navbar-collapse navbar-left" role="application"></div>');

        element
            .addClass("nav navbar-nav")
            .attr({
                "role": "menubar"
            });

        // Marcar item de menu (de forma geral)
        element.find('li > a').attr("role", "menuitem");

        // Marcar itens agrupadores
        // group são todos 'li' de primeiro nível que possuem 'ul'
        group = element.children('li').has('ul');

        group.addClass("dropdown groupMenu");

        group.children('a')
            .addClass("dropdown-toggle")
            .attr({
                "data-hover":    "dropdown",
                "data-toggle":   "dropdown",
                "data-delay":    1000,
                "aria-haspopup": "true",
                "aria-expanded": "false"
            });

        // Listas que contém as opções de segundo nível
        group.find("ul")
            .addClass("dropdown-menu")
            .attr({
                "role":        "menu",
                "aria-hidden": "true"
            });

        /* Insere id's nos itens de menu */
        // Define id para todos os itens de menu (tanto primeiro quanto segundo nível)
        element.find('li').uniqueId();

        // Aplicação de atributos wai-aria
        element.closest("nav").attr("aria-label", "Menu de opções globais");

        element.find("li").on('mouseover' + eventNamespace, function(e) {
            e.stopPropagation();
        });

        /* Instacia Boostrap Dropdown Hover */
        element.find('.dropdown-toggle').dropdownHover();

        this.setCurrent('li[data-pic-state-current]');

        element.removeAttr("tabindex");
        element.find('li').removeAttr('tabindex');
        element.find('li > a').attr('tabindex', '-1');
        element.find(".dropdown-menu > li").removeAttr("tabindex");

        element.find("li").first().children("a").attr("tabindex", "0");

        // @TODO Atenção! Isso quebra um conceito principal dos widgets, que é não atuar em nenhum ponto além das fronteiras do elemento marcado.
        element.closest("#banner")
               .find(".nomeAplicacao, .identAplicacao")
               .after("<a class=\"navbar-toggle menuPrimario\" data-toggle=\"collapse\" href=\"#menubar\">" +
         "<span class=\"sr-only\">Mostrar Navegação Global</span>" +
         "<span class=\"glyphicon glyphicon-menu-hamburger\" aria-hidden=\"true\"></span></a>");

        /* Insere interação com teclado no menu */
        var submenu = false;

        element.on('show.bs.dropdown' + eventNamespace, function (e) {

            var groupItem = $(e.target);
            groupItem.next().attr('aria-hidden', 'false');
        });

        element.on('hide.bs.dropdown' + eventNamespace, function (e) {

            var groupItem = $(e.target);
            groupItem.next().attr('aria-hidden', 'true');
        });

        // Para todos os itens de primeiro nível (sejam agrupadores ou não)
        element.children('li').on('keydown' + eventNamespace, function(e) {
            var keyCode = e.which;

            //right
            if (keyCode == key.right) {
                submenu = false;
                $(this).removeClass("open");
                $(this).children("a").attr("tabindex", "-1");
                $(this).children("ul").attr("aria-hidden", "true");

                // Se é o último item, deve "passar" para o primeiro.
                if ($(this).next().index() == -1) {
                    $(this).parent().children().first().children("a").attr("tabindex", "0");
                    $(this).parent().children().first().children("a").focus();

                } else {
                    $(this).next().children("a").attr("tabindex", "0");
                    $(this).next().children("a").focus();
                }

            //left
            } else if (keyCode == key.left) {
                submenu = false;
                $(this).removeClass("open");
                $(this).children("a").attr("tabindex", "-1");
                $(this).children("ul").attr("aria-hidden", "true");

                // Se é o primeiro item, deve "passar" para o último.
                if ($(this).index() === 0) {
                    $(this).parent().children().last().children("a").attr("tabindex", "0");
                    $(this).parent().children().last().children("a").focus();
                } else {
                    $(this).prev().children("a").attr("tabindex", "0");
                    $(this).prev().children("a").focus();
                }
            //enter - up - down
            } else if (keyCode == key.up || keyCode == key.down || keyCode == key.enter) {
                // Não afeta os items que não são agrupadores.
                if ($(this).hasClass('groupMenu')) {
                    if (submenu === false) {
                        //e.stopPropagation();
                        e.preventDefault();
                        $(this).addClass("open");
                        $(this).children("ul").attr("aria-hidden", "false");
                        $(this).children("ul").children().first().children().attr("tabindex", "0");
                        $(this).children("ul").children().first().children().focus();
                    }
                }
            }
        });

        // Para todos os itens de segundo nível
        group.find("li").on('keydown' + eventNamespace, function(e) {
            var keyCode = e.which;

            //up
            if (keyCode == key.up) {
                submenu = true;
                e.stopPropagation();
                e.preventDefault();
                $(this).children().attr("tabindex", "-1");
                $(this).prev().children().attr("tabindex", "0");

                if ($(this).index() === 0) {
                    $(this).parent().children().last().children().focus();
                } else {
                    $(this).prev().children().focus();
                }
            //down
            } else if (keyCode == key.down) {
                submenu = true;
                e.stopPropagation();
                e.preventDefault();

                $(this).children().attr("tabindex", "-1");
                $(this).next().children().attr("tabindex", "0");

                $(this).next().children().focus();

                if ($(this).next().index() == -1) {
                    $(this).parent().children().first().children().attr("tabindex", "0");
                    $(this).parent().children().first().children().focus();
                } else {
                    $(this).next().children().focus();
                }

            //esc
            } else if (keyCode == key.esc) {
                e.stopPropagation();
                e.preventDefault();
                $(this).parent().prev().attr("tabindex", "0");
                $(this).parent().find("li a").attr("tabindex", "-1");
                $(this).parent().parent().removeClass("open");
                $(this).parent().attr("aria-hidden", "true"); // O menu suspenso é fechado e precisa ser escondido.
                $(this).parent().prev().focus();
                submenu = false;
            // tab
            } else if (keyCode == key.tab) {
                submenu = false;
                $(this).parent().parent().removeClass("open");
                $(this).parent().attr("aria-hidden", "true"); // O menu suspenso é fechado e precisa ser escondido.
                $(this).parent().find("li a").attr("tabindex", "-1");
            }
        });

        /*
		* Fecha menu global de acordo com o click fora da área do menu em telas pequenas
		*/
        $(document).on('click' + eventNamespace, function (event) {
            var clickover = $(event.target),
				target,
                collapse = element.parent().hasClass("in");

                if (collapse === true) {
                    target = element.parent().attr("id");
                }

                if (collapse === true && !$(target).find(clickover).length) {
					$(".topoAplicacao").find("[data-target=#"+target+"]").click();
                }

                /* Quando subitens selecionados via teclado o estado do seu tabindex á alterado para 0,
                então quando os subitens são abandonados atravéz do clickover do moouse
                seu estado deve retornar para o estado incial que é -1.
                */
                group.find("li a").attr("tabindex", "-1");
        });
    };

    Globalnav.prototype = {

        name: 'Globalnav'
    };

    /*
     * Solicita o registro do widget
     */
    PIC.widgetRegister(Globalnav);

})(jQuery, window, document);
})();
/* Início de novo arquivo concatenado */
(function () {/* Localnav */
/**
Transforma uma lista (em um ou dois níveis) em um menu local.

Use `data-pic-state-current` no item de menu (`li`) que representa a página atual, seja um item
de primeiro nível (que não seja um agrupador) ou segundo nível. *O uso desse atributo em um item
agrupador é inválido*.

@module Localnav
@attribute data-pic-localnav
@example
<ul class="navbar-collapse" data-pic-localnav>
    <li><a href="#">Funcionalidade de Primeiro Nível</a></li>
    <li><a href="#">Outra Funcionalidade como a Anterior</a></li>
    <li>
        <a href="#">Categoria Hipotética</a>
        <ul>
            <li><a href="#">Um item</a></li>
            <li><a href="#">Outro</a></li>
            <li><a href="#">E mais um da mesma categoria</a></li>
        </ul>
    </li>
    <li>
        <a href="#">Outra Categoria</a>
        <ul>
            <li><a href="#">Seja consistente</a></li>
            <li><a href="#">Agrupe adequadamente</a></li>
        </ul>
    </li>
    <li>
        <a href="#">Formas de Levantar as Categorias</a>
        <ul>
            <li><a href="#">Card Sorting</a></li>
            <li><a href="#">Focus Groups</a></li>
            <li><a href="#">Estudo do Negócio</a></li>
        </ul>
    </li>
</ul>
*/

;(function ($, window, document, undefined) {

    'use strict';

    /*
     * Variáveis globais
     */

    /*
     * Sobrescrevendo os valores default do plugin que está sendo estendido.
     * Esses valores que servem para todas as instâncias do plugin.
     */
    $.fn.navgoco.defaults.cookie.expires = 10;

    /*
     * Definição da classe
     */
    var Localnav = function (widgetHelper) {

        var name = this.name,
            element = widgetHelper.element,
            options = widgetHelper.options,
            eventNamespace = widgetHelper.eventNamespace,
            numContainer = 0,
            count = 0,
            menuLateral,
            btnCollapse,
            btnExpander,
            comboMenuLateral,
            controles,
            scrollWatcher,
            toggled = false,
            navgocoOptions = {};

        /*
         * Métodos públicos
         */

        /**
         * Seta o item (`li`) informado como o item corrente (ativo) do menu.
         *
         * Se for informado um item de segundo nível, o primeiro nível é tratado automaticamente.
         *
         * @method setCurrent
         * @param li {mixed} - Item a ser marcado como o corrente. Pode ser informado como um seletor, um elemento ou um objeto jQuery.
         * @returns {boolean} Indica se foi possível (true) ou não (false) setar o item informado como o corrente.
         * @instance
         */
        this.setCurrent = function (item) {

            // Garante que o item seja um objeto jQuery, e apenas um.
            item = element.find(item).filter('li').first();

            // Se o item existe e não possui subitens
            if (item.length && item.has('ul').length === 0) {

                // Remove a classe active de qualquer 'li' que a possua
                element.find('li.active').removeClass('active');
                // Insere a classe 'active' no item encontrado.
                item.addClass('active');
                // Se a marca não está num item de primeiro nível (deve estar num de segundo)
                if (!item.closest('ul').is(element)) {
                    // Marca o pai também como active
                    item.parent().closest('li').addClass('active');
                    // Expande o pai para que o filho ativo seja mostrado.
                    element.navgoco('toggle', true, item.parent().data('index'));
                }
                return true;
            }
            return false;
        };

        this.destroy = function () {

            // Desliga listeners dos eventos associados ao namespace do plugin
            widgetHelper.clearEvents();
            // Devolve tabindex
            element.find('a').removeAttr('tabindex');
            // Para de monitorar a scroll
            clearInterval(scrollWatcher);
            
            if (PIC.isXS($(window).width())) {
                // Para telas pequenas, remover estilos inline para devolver altura do element.
                element.css('height', '');
            }
            // Voltar a mostrar as ul que podem ter estar escondidas com display:none;
            element.find('ul[role=group]').css('display', '');
            // Removendo comboMenuLateral
            comboMenuLateral.remove();
            // Removendo atributo aria
            element.closest('nav').removeAttr('aria-label');
            // Removendo controles
            controles.remove();
            // Removendo div.menu-ul
            element.unwrap();
            // Removendo div#menu-lateral
            element.unwrap();

            element.removeClass('system-nav collapse');
            // Removendo classe 'active', inserida por setCurrent
            element.find('active').removeClass('active');
            // Destrói o navgoco
            element.navgoco('destroy');
        };

        /*
         * Métodos privados
         */

        // Função que fecha (colapsa) o element se ele estiver aberto.
        var collapse = function () {
            if (element.hasClass('in')) {
                element.collapse('hide');
            }
        };

        var menu = function () {
            var countSubMenu = 0,
                countSubMenuVisivel = 0;

            element.find(" > li > ul").each(function () {
                countSubMenu++;

                if ($(this).parent().hasClass('open')) {
                    countSubMenuVisivel++;
                }
            });

            if (countSubMenu == countSubMenuVisivel) {
                btnCollapse.find("#collapseAll span").removeClass("glyphicon-eye-open");
                btnCollapse.find("#collapseAll span").addClass("glyphicon-eye-close");
                count = Number(countSubMenuVisivel);
            } else {
                btnCollapse.find("#collapseAll span").removeClass("glyphicon-eye-close");
                btnCollapse.find("#collapseAll span").addClass("glyphicon-eye-open");
                count = Number(countSubMenuVisivel);
            }

            if (countSubMenu === 0) {
                btnCollapse.find("#btn-collapse").css("display", "none");
            }
        };

        // Ajusta o tabindex ao fechar um submenu
        var setSubmenuTabindex = function (submenu, opening) {

            var tabbableSubitem;

            // Se o submenu está sendo aberto, não há nada a fazer aqui.
            if (opening) {
                return;
            }

            // Localiza possível item (dentro do submenu sendo fechado) que pode receber foco com tab.
            tabbableSubitem = submenu.find('> li > a[tabindex=0]');

            // Se há um subitem do menu que pode receber foco com tab.
            if (tabbableSubitem.length > 0) {
                // Passa a possibilidade de foco com tab para o link do agrupador do submenu.
                tabbableSubitem.attr('tabindex', '-1');
                submenu.prev().attr('tabindex', '0');
            }
        };

        var windowSize = function () {

            var w = $(window).width();

            // @TODO O que é 754? trocar por uma função do PIC que teste isso (ixXS, talvez)
            if (w < 754) {
                if (toggled) {
                    $('#wrapper').removeClass('toggled');
                    $("#btn-expander").removeClass('minimizar');
                    toggled = false;
                }
            }
        };

        // Verifica se a altura necessária para o Localnav é maior
        // do que a altura disponível em tela para ele.
        // Fixa a altura do Localnav, se for necessário; e retorna true/false indicando
        // a presença ou não de scrollbar no Localnav.
        var hasScrollBar = function () {

            var menuUl = menuLateral.find('.menu-ul');

            var sideBarPaddingBottom = menuUl.css("padding-bottom");
            var sidebar = $('#pic-menu-local').length;
            /* If inserido para corrigo BUG momentaneamente, retirar posteiormente e corrigir BUG */
            if(sidebar !== 0){
                var vlrPadding = parseInt(sideBarPaddingBottom.replace("px", ""));
                var sideBarTop = $("#pic-menu-local").css("top");
                sideBarTop = sideBarTop.replace("px", "");
                var alturaJanela = $(window).height();

                //Caso a área seja maior que 768 a altura da scroll do sidebar é controlada dinamicamente
                // @TODO Usar função PIC.isXS() aqui.
                if ($(window).width() > 768) {
                    menuUl.css("height", $(window).height() - sideBarTop - $(".rodape").innerHeight());
                } else {
                    menuUl.css("height", "auto");
                }
                return menuUl.get(0).scrollHeight > menuUl.height() + vlrPadding;
            }
        };

        /*
         * Instanciação do plugin que está sendo estendido.
         */
        navgocoOptions.onClickAfter = menu;
        navgocoOptions.onToggleBefore = setSubmenuTabindex;

        element.navgoco(navgocoOptions);

        this.setCurrent('li[data-pic-state-current]');

        /*
         * Implementação do plugin (o que o plugin faz ou estende ao comportamento de outro)
         */

        // Click no document (click fora de localNav) fecha o element.
        $(document)
            .ready(windowSize)
            .on('click'+eventNamespace, collapse);

        $(window).on('resize'+eventNamespace, windowSize);

        element.addClass('system-nav collapse');

        //Cria a marcação necessária para apresentação do botão de expansão e retração
        // @TODO verificar como remover esse id daqui
        element.wrap('<div id="menu-lateral"></div>');
        menuLateral = element.parent();
        element.wrap('<div class="menu-ul"></div>');
        menuLateral.append('<div class="controles-navgoco"></div>');
        controles = menuLateral.children('.controles-navgoco');
        controles.append('<div id="btn-expander"><a data-placement="right" title="Minimizar"><span class="glyphicon glyphicon-arrow-left"></span></a></div>');
        controles.append('<div id="btn-collapse"><a data-placement="right" href="#" id="collapseAll"><span class="glyphicon glyphicon-eye-open"></span></a></div>');
        btnCollapse = controles.children('#btn-collapse');
        btnExpander = controles.children('#btn-expander');

        //Aplicação de atributos wai-aria
        element.closest("nav").attr("aria-label","Menu de opções locais");

        menuLateral.closest("nav").prepend('<button type="button" class="navbar-toggle comboMenuLateral" data-toggle="collapse" data-target=":parent .system-nav"> <span class="sr-only">Abrir menu de opções locais</span> <span class="glyphicon glyphicon-menu-hamburger"></span>Opções Locais</button>');
        comboMenuLateral = menuLateral.closest('nav').find('.comboMenuLateral');

        //Para telas pequenas o menu se inicia fechado
        if (PIC.isXS($(window).width())) {
            element.find("li").each(function () {
                if ($(this).hasClass("open")) {
                    $(this).removeClass("open").children("ul").css("display", "none");
                }
            });
        }

        //Adicionar e remove scroll no menu quando sua altura ultrapassa a altura da janela
        scrollWatcher = setInterval(function () {
            if (hasScrollBar()) {
                element.addClass('scrollAtiva');
            } else {
                element.removeClass('scrollAtiva');
            }
        }, 200);

        //Adiciona classe active ao botão que ativa e desativa o menu
        comboMenuLateral.on('click' + eventNamespace, function () {
             $(this).toggleClass("active");
        });

        //Associa o listener à ação de click e controla a ação
        btnCollapse.find("#collapseAll").on('click' + eventNamespace, function (e) {
            e.preventDefault();
            count++;

            if (count % 2 === 0) {
                if ($(this).children().attr("class") == "glyphicon glyphicon-eye-close") {
                    $(this).children().removeClass("glyphicon-eye-close").addClass("glyphicon-eye-open");
                }
                element.navgoco('toggle', false);
            } else {
                if ($(this).children().attr("class") == "glyphicon glyphicon-eye-open") {
                    $(this).children().removeClass("glyphicon-eye-open").addClass("glyphicon-eye-close");
                }
                element.navgoco('toggle', true);
            }
        });

        //Associa o listener à ação de click e controla a ação
        btnExpander.on('click' + eventNamespace, function () {
            $(this).toggleClass('minimizar');
            $('#wrapper').toggleClass('toggled');
            if ($('#wrapper').hasClass('toggled')) {
                toggled = true;
            } else {
                toggled = false;
            }
        });
    };

    Localnav.prototype = {

        name: 'Localnav'
    };

    /*
     * Solicita o registro do widget
     */
    PIC.widgetRegister(Localnav);

})(jQuery, window, document);

})();
/* Início de novo arquivo concatenado */
(function () {/* Liveregion */
/**
Transforma um bloco com conteúdo alterável dinammicamente e o elemento disparador para:

1. Acrescentar marcação acessível com base nos recursos de Live Regions (aria-live)
2. Prover feedback visual da área cuja atualização deve ser realizada
3. Acrescentar o listener do evento disparador da ação que deve prover a atualização
4. Prover API para bloqueio e desbloqueio do acesso do usuário à área em atualização

@module Liveregion
@ignore
@attribute data-pic-liveregion
@param {string} [showBusy=false] - Determina se a caixa será mostrada como se estivesse ocupada - com acesso bloqueado. Valores possíveis: true|false
@param {string} [atomic=false] - Determina se uma alteração no conteúdo da área deve gerar comunicação - pelas tecnologias assistivas - de toda a área ou somente das alterações. Valores possívels: true|false
@param {string} [relevantChanges=insertions] - Determina que tipos de alteraçẽos no conteúdo devem ser communicados para tecnologias assistivas. Valores possíveis: insertions|exclusions|all

@example
<!-- O botão que dispara a animação. Atente para o valor passado para ele - o valor do id, da área dinâmica - para promover o link -->
<button data-pic-liveregion-trigger="id-do-alvo">It's Show Time</button>

<!-- A região dinâmica em si -->
<div data-pic-liveregion id="id-do-alvo">
    <p>Conteúdo que será alterado dinamicamente</p>
</div>

*/
;(function ($, window, document, undefined) {

    'use strict';

    /*
     * Definição da classe
     */
    var Liveregion = function (widgetHelper) {

        /*
         * Variáveis de instância
         * Defina todas aqui antes de usar
         */
        var name = this.name,
            options = widgetHelper.options,
            eventNamespace = widgetHelper.eventNamespace,
            element = widgetHelper.element,
			originalStyle,
			trigger,
			that = this;
		
		var busyMark = "<div class='maskLoaderPic maskAbsolute invert'><div class='loaderPic spinMed'></div></div>";

        /*
         * Métodos públicos
         * São chamados de dentro da classe: this.metodoPublico()
         * São chamados externamente: umaInstancia.metodoPublico()
         */

        /**
         * Pede atenção para a região dinâmica
         *
         * @method highlight
         * @param showBusy {string} - Opcional. Define se, ao final da animação, a área será apresentada como ocupada. Valores válidos: true|false
         * @instance
         */
        this.highlight = function (showBusy) {
			var animationClass = "pulse",
				refreshingTime = 1000;

			if(showBusy===undefined) {
				showBusy = options.showBusy;
			}

			// Anima a visualização da regiao para chamar atenção
			element.addClass(animationClass);
			setTimeout(function() {
				element.removeClass(animationClass);
			}, refreshingTime);
			scrollTarget();
			// Rola a tela para trazer a visualização para o foco visual, se estiver fora da viewport
			
			// Configura o estado da caixa para ocupado, se solicitado na configuração
			if (showBusy === "true") {
				that.busy();
			}
        };

        /**
         * Altera a visaulização para área ocupada (aguardando liberação)
         *
         * @method busy
         * 
         * @instance
         */
        this.busy = function () {
			element.attr("aria-busy","true")
				.find(".liveBox")
				.addClass("busy");
        };

        /**
         * Altera a visualização para área disponível para uso/leitura
         *
         * @method idle
         * 
         * @instance
         */
        this.idle = function () {
			element.removeAttr("aria-busy")
				.find(".liveBox")
				.removeClass("busy");
        };

        // Destrói instância do Liveregion
        // @TODO Revisar para ver se está funcionando bem.
        this.destroy = function () {

            widgetHelper.clearEvents();

			element
				.removeAttr('aria-live aria-atomic aria-relevant aria-busy')
				.removeClass("animated")
				.find(".liveBox")       //Altera o contexto e aplicação dos próximos métodos
				.removeClass("busy");

            // Devolve o valor original de style
            element.attr('style', originalStyle);
        };

        /*
         * Métodos privados
         * São chamados apenas de dentro da classe: metodoPrivado()
         */

        var scrollTarget = function () {
			//Determina se o alvo está visível na tela
			//Promove o scroll da página para uma vizualização que apresente o alvo confortavelmente
			var targetPosition = element.offset().top,
				viewportHeight = $(window).actual("height");
				
			if (!widgetHelper.fitDown(element)) {
					$("html, body").animate({
        				scrollTop: targetPosition - (0.1 * viewportHeight)
        			}, {duration: 500, specialEasing:"easeOutBounce"});
				//$(window).scrollTop(targetPosition);
			}
			
		};

		//Transforma o gatilho da ação e acopla o listener
		var transformTrigger = function() {
			var target = element;
		//	var regionId = element.attr("id");
		//	trigger = $( "[data-pic-liveregion-trigger='#" + regionId + "']" );
			
			$("[data-pic-liveregion-trigger]").each(
				function () {
					var match = $($(this).attr("data-pic-liveregion-trigger")).filter(target).length;
					
					if (match) {
						$(this).on("click"+eventNamespace, 
							function() {
								that.highlight(options.showBusy);
							});
					}
					
				}
			);
			
		//	trigger.on("click"+eventNamespace, function() {
		//		that.highlight(options.showBusy);
		//	});
		};
		
        /*
         * Implementação do plugin (o que o plugin faz ou estende ao comportamento de outro)
         */

		originalStyle = element.attr("style");

		//Transforma o elemento, de acordo com os parâmatros
		element
			.attr("aria-live","polite")
			.addClass("animated");

		if (!element.attr("aria-atomic")) {
			element.attr("aria-atomic",options.atomic);
		}

		if (!element.attr("aria-relevant")) {
			element
				.attr("aria-relevant",  
					  options.relevantChanges === "insertions" ? "additions text" : 						options.relevantChanges);
		}
		//Prepara a caixa para ser marcada como ocupada, quando necessário
		element.find(".liveBox").append(busyMark);
		
		//Chama a transofrmação do gatilho
		transformTrigger();
    };


    Liveregion.prototype = {

        name: 'Liveregion',

        defaults: {
            atomic: 'false',
            relevantChanges: 'insertions',
            showBusy: 'true'
        },

        domains: {
            atomic: ['true', 'false'],
            relevantChanges: ['all', 'insertions', 'removals'],
            showBusy: ['true', 'false']
        }
    };

    /*
     * Solicita o registro do widget
     */
    PIC.widgetRegister(Liveregion);

})(jQuery, window, document);

})();
/* Início de novo arquivo concatenado */
(function () {/* Mask */
/**
Associa um listener para capturar a entrada em um input ou formatar uma div ou span e formatar conforme uma máscara definida pelo projetista

A descrição pode utilizar elementos de markdown para formatação. Deixe uma linha em branco para representar uma quebra de linha.

@module Mask
@attribute data-pic-mask
@param {string} pattern - Máscara a ser aplicada, de acordo com regras específicas. 
@param {boolean} [reverse=false] - Define se a máscara deve ser aplicada da direita para a esquerda.
@param {string} [originalValue=mask] - Define se a máscara deve compor o valor do campo de formulário para envio. Valores possíveis: keep|mask
@example
<input type="text" name="data-inicio" data-pic-mask='{"pattern" : "00/00/0000"}' />
*/
;(function ($, window, document, undefined) {

    'use strict';

    /*
     * Variáveis globais
     * no escopo da closure
     */

    /*
     * Executa apenas uma vez, na carga da página
	 */

    /*
     * Definição da classe
     */
    var Mask = function (widgetHelper) {

        /*
         * Variáveis de instância
		 */
        var name = this.name,
            element = widgetHelper.element,
            options = widgetHelper.options,
            eventNamespace = widgetHelper.eventNamespace;

		var appliedMask = options.pattern,
			targetField = element,
			auxField = $("<span>"),
			invalidKeyFeedbackTime = 500,
			pluginOptions;

        /*
         * Métodos públicos
         *   São chamados de dentro da classe: this.metodoPublico()
         *   São chamados externamente: $(selector).picMeuwidget().metodoPublico()
         */
        this.metodoPublico = function (p1, p2) {

        };
        
        this.destroy = function () {
			element.unmask();
			widgetHelper.clearEvents();
        };

        /*
         * Métodos privados
         * São chamados apenas de dentro da classe: metodoPrivado()
         */
		var setErrorState = function (alvo) {
			//Marca o elemento com estado temporário de erro
			$(alvo).addClass("e1");
			setTimeout(function () {
				alvo.removeClass("e1");
			}, invalidKeyFeedbackTime);
		};

		/*
		 * Trata os eventos de colagem por arrastar e soltar ou por ctrl-v
		 */
		element.on("paste" + eventNamespace + " drop" + eventNamespace, function (e) {

			var transferData = e.originalEvent.clipboardData || e.orignalEvent.dataTransfer;
			var key = transferData.types[0];
			var pasted = transferData.getData(key);
			var masked, unmasked;

			auxField.mask(appliedMask);
			masked = auxField.masked(pasted);

			if (pasted !== masked) {
				unmasked = auxField.text(pasted).unmask().text();
				if (pasted !== unmasked) {
					setErrorState(element);
					return false;
				}
			}
		});

		//Aplicação da máscara - o que faz o elemento funcionar de fato
		pluginOptions =  {
			reverse: false,

			onInvalid: function (val, e, f, invalid, options) {
				var error = invalid[0];

				setErrorState(element);
			}
		};
		
		pluginOptions.reverse = options.reverse;
		targetField.mask(appliedMask, pluginOptions);

	};

	/*
     * Métodos estáticos (métodos de classe)
     */

    /**
     * Aplica manualmente uma máscara em um campo específico.
     * Para remover a máscara adicionada assim, use [removeMask]{@link module:Mask.removeMask}
     * 
     * @method applyMask
     * @param field {jquery object} - Campo de entrada ou span conteńdo conteúdo que pode ser mascarado. Pode ser informado como um seletor, um elemento ou um objeto jQuery.
     * @param mask {string} - Máscara a ser aplicada. 
     * @returns {boolean} Indica se aplicou (true) ou não (false) a máscara no campo.
     * @static
     */
    Mask.applyMask = function (field, mask, reversible) {
        var opcoes = {};

        field = $(field);

		if (reversible === true) {
			opcoes.reverse = true;
		}
		field.mask(mask, opcoes);

        return true;
    };

    /**
     * Remove manualmente uma máscara em um campo específico.
     * 
     * @method removeMask
     * @param field {jquery object} - Campo de entrada ou span conteńdo conteúdo mascarado. Pode ser informado como um seletor, um elemento ou um objeto jQuery.
     * @param mask {string} - Máscara a ser comparada para remoção. 
     * @returns {boolean} Indica se removeu (true) ou não (false) a máscara no campo.
     * @static
     */
    Mask.removeMask = function (field) {

        field = $(field);

		field.unmask();
        return true;
    };
	
    Mask.prototype = {
        
        name: 'Mask',
        
        defaults: {
            originalValue: 'mask',
			reverse: false
        },
        
        domains: {
            originalValue: ['mask', 'keep'],
			reverse: [true, false]
        }
    };
    
    /*
     * Solicita o registro do widget
     */
    PIC.widgetRegister(Mask);

})(jQuery, window, document);

})();
/* Início de novo arquivo concatenado */
(function () {/* Adaptableheader */
;(function ($, window, document, undefined) {

    'use strict';

    /*
     * Variáveis globais
     */

    /*
     * Definição da classe
     */
    var Adaptableheader = function (widgetHelper) {

        /*
         * Variáveis de instância
         */
        var name = this.name,
            element = widgetHelper.element,
            options = widgetHelper.options,
            eventNamespace = widgetHelper.eventNamespace,
            windowWidth = $(window).width(),
			requiredContext = $("header");
            
        /* 
         * Métodos públicos
         */

        this.destroy = $.noop;
         
        /*
         * Métodos privados
         */
        var toggleMenuState = function () {
            
            var currentWindowScroll = $(window).scrollTop(),
                adaptingHeight = requiredContext.find("#cabecalho").height() +
                                     requiredContext.find("#pic-menu-global").height() + 10,
                wrapper = requiredContext.closest("#wrapper");

            if (currentWindowScroll > adaptingHeight) {

                if ( !wrapper.hasClass("menuGlobalReduzido")) {
                    wrapper.addClass("menuGlobalReduzido");

                    if (requiredContext.find("#pic-menu-global").length === 0) {

                        wrapper.find("header")
                               .append('<div id="pic-menu-global-fake">&nbsp;</div>');
                    }
                }
            } else {

                wrapper.removeClass("menuGlobalReduzido");
                wrapper.find("#pic-menu-global-fake").remove();
            }
        };

        /*
         * Implementação do plugin
         */
        if (PIC.isMD(windowWidth) || PIC.isLG(windowWidth)) {
            $(window).on('scroll'+eventNamespace, toggleMenuState);
        }
    };
    
    Adaptableheader.prototype = {
        
        name: 'Adaptableheader'
    };

    /*
     * Solicita o registro do widget
     */
    PIC.widgetRegister(Adaptableheader);

})(jQuery, window, document);

})();
/* Início de novo arquivo concatenado */
(function () {/* Themes */
/**
Cria toda a estrutura e funcionamento do seletor de temas do PIC no cabeçalho

Depende apenas da existência do elemento de classe `.topoAplicacao` dentro do elemento `header`.
Verifica a existência dos elementos antes de criá-los

@module Themes
*/
;(function ($, window, document, undefined) {

    'use strict';

    /*
     * Variáveis globais
     * no escopo da closure
     */
    var requiredParent = $('header .topoAplicacao'),
		triggerTemas,
		listaTemas,
		themeName;
		//Força o carregamento antecipado do módulo 'cookie' do YUI, para fins de performance
		YUI().use('cookie', function(Y) {
			return false;
		});

    /*
     * Definição da classe
     */
    var Themes = function (widgetHelper) {

        /*
         * Variáveis de instância
         */
        var name = this.name,
            element = widgetHelper.element,
            options = widgetHelper.options,
            eventNamespace = widgetHelper.eventNamespace,
            suporteGlobal,
			funcoesGlobais,
			seletorTemas;
		
        /* 
         * Métodos públicos
         */

        this.destroy = $.noop;
        
        /*
         * Métodos privados
         */
        var construirElementosuporteGlobal = function () {
			return $('<div class="suporteGlobal"></div>');
        };
		
        var construirElementoFuncoesGlobais = function () {
			return $('<ul class="funcoesGlobais"></ul>').addClass("collapse");
        };
		
        var construirElementoSeletorTemas = function () {
            
			var agrupadorTemas;
            
			agrupadorTemas = $('<li class="dropdown temas"></li>');
			triggerTemas = $('<a href="#" class="dropdown-toggle" id="dropdownMenuTemas" data-toggle="dropdown" aria-expanded="false">' +
							 '<span class="glyphicon glyphicon-tint" aria-hidden="true"></span>' +
							 '<span class="letra">Temas</span>' +
							 '</a>');

			listaTemas = $('<ul class="dropdown-menu dropdown-menu-right " aria-hidden="true" id="menuTemas" role="menu" aria-labelledby="dropdownMenuTemas">' +
						   '<li role="menuitem"><a href="#" class="btnAlteraTema" id="tema_amarelo" tabindex="-1">Amarelo</a></li>' +
						   '<li role="menuitem"><a href="#" class="btnAlteraTema" id="tema_azul" tabindex="-1">Azul</a></li>' +
						   '<li role="menuitem"><a href="#" class="btnAlteraTema" id="tema_camaranet" tabindex="-1">Camaranet</a></li>' +
						   '<li role="menuitem"><a href="#" class="btnAlteraTema" id="tema_verde" tabindex="-1">Verde</a></li>' +
						   '<li role="menuitem"><a href="#" class="btnAlteraTema" id="tema_vermelho" tabindex="-1">Vermelho</a></li>' +
						   '<li role="menuitem"><a href="#" class="btnAlteraTema" id="tema_altocontraste" tabindex="-1">Alto contraste</a></li>' +
						   '</ul>');
			
			agrupadorTemas.append(triggerTemas);
			agrupadorTemas.append(listaTemas);
			return agrupadorTemas;
        };
		
		var themeMark = function(themeName) {
            
			listaTemas.children().each(function(){
				$(this).children().removeClass("active");
			});
		
			listaTemas.children().each(function(){
				if($(this).children().attr("id") === themeName){
					$(this).children().addClass("active");
				}
			});
		};
		
		var configurarComportamento = function() {

			var switch_style = {
				onReady: function () {
				  this.switch_style_click();
				},

				switch_style_click: function(){
					$(".btnAlteraTema").on('click'+eventNamespace, function(e) {
                        
						var id = $(this).attr("id"),
                            pathArray = window.location.pathname.split( '/' ),
                            levelLocation = pathArray[1],
                            // Daqui a cem anos, mês de janeiro
                            expires = new Date((new Date()).getFullYear() + 100, 0);
						
						YUI().use('cookie', function(Y) {
							themeMark(id);
							Y.Cookie.set("id", id, { 
								path: "/" + levelLocation,
								expires: expires
							});
						});
						console.log(PIC.path+"css/"+id+".css");
						$("#themePic").attr("href", PIC.path+"css/"+id+".css");
						e.preventDefault();

					});
					
				}
			};

			//Configurar o tema de acordo com o cookie
				YUI().use('cookie', function(Y) {
					var idTema = Y.Cookie.get("id");
					themeMark(idTema);
					if (!!idTema) {
						Y.Get.css(PIC.path+ 'css/' +idTema+ '.css', {
							attributes: { 'id':'themePic'}},
							function (err) {
							if (err) {
								Y.log('Error loading CSS: ' + err[0].error, 'error');
								return;
							}
							Y.log('Tema ' + idTema + ' carregado...');
						});
					} else {
						Y.Get.css(PIC.path+ 'css/tema_camaranet.css', {
							attributes: { 'id':'themePic'}},
							function (err) {
							if (err) {
								Y.log('Error loading CSS: ' + err[0].error, 'error');
								return;
							}

							Y.log('Tema Camaranet carregado...');
						});
					}
					//Altera display do body para block apresentando conteúdo
					$(document).ready(function () {
						$("body").css("display", "block");
					});
				});
					
				switch_style.onReady();
		};

        /*
         * Implementação do plugin
         */
		
		//verifica se há o ancestral necessário para a estrutura
		if(requiredParent.length !== 0) {
			//verifica se já existe e cria, se necessário, o elemento .suporteGlobal e o adiciona ao final (append)
			if(requiredParent.find('.suporteGlobal').length===0) {
				suporteGlobal = construirElementosuporteGlobal();
				requiredParent.append(suporteGlobal);
			}
			suporteGlobal = requiredParent.find('.suporteGlobal');
			//verifica se já existe e cria, se necessário, o elemento .funcoesGlobais em .suporteGlobal e o adiciona ao final (append)
			if(suporteGlobal.find('.funcoesGlobais').length===0) {
				funcoesGlobais = construirElementoFuncoesGlobais();
				suporteGlobal.append(funcoesGlobais);
			}
			funcoesGlobais = suporteGlobal.find('.funcoesGlobais');
			//verifica se já existe e cria, se necessário, o elemento .dropdown.temas em .funcoesGlobais e o adiciona ao final (append)
			if(funcoesGlobais.find('.dropdown.temas').length===0) {
				seletorTemas = construirElementoSeletorTemas();
				funcoesGlobais.append(seletorTemas);
			}
			seletorTemas = funcoesGlobais.find('.dropdown.temas');
			seletorTemas.find('[data-toggle=dropdown]').dropdownHover();
		}
		//Chama função que controla o estado dos cookies e aciona o tema selecionado
		configurarComportamento();

		$(document).triggerHandler('pic:themesReady');
		/* Configurações para navegação por teclado
		triggerTemas.on("keydown", function(e){
			var keyCode = e.keyCode || e.which;
			switch(keyCode){
                case key.enter:
					$(this).click();
					$(this).next().attr("aria-hidden", "false");					
					$(this).next().children().first().children().focus();
                    e.preventDefault();
                    break;          
            }			
		})
		
		listaTemas.on("keydown", "li", function(e){
			var keyCode = e.keyCode || e.which;			
			switch(keyCode){
                case key.right:
                case key.down:
					$(this).next().children().focus()
                    e.preventDefault();
                    break;
                case key.left:
                case key.up:
					$(this).prev().children().focus()
                    e.preventDefault();
                    break;
                case key.end:
					$(this).parent().children().last().children().focus()
                    e.preventDefault();
                    break;
                case key.home:
					$(this).parent().children().first().children().focus()				
                    e.preventDefault();
                    break;          
				case key.tab:
                    break;				
            }			
		})
		*/
		
    };
    
    Themes.prototype = {
        
        name: 'Themes'
    };
	
    /*
     * Solicita o registro do plugin
     */
    PIC.widgetRegister(Themes);

})(jQuery, window, document);

})();
/* Início de novo arquivo concatenado */
(function () {;(function ($) {
        /* **
         * Snippety plugin
         * Inserts snippets in your page according to the references informed in anchors.
         * It replaces the anchor by the snippet itself.
         * 
         * Usage:
         * 1. Create a complete html file that contains the html snippet you want.
         * 2. Mark down the snippet with the attribute data-pic-doc="snippet".
         * 3. On the html page where do you want to insert the snippet, create an anchor that refers to the snippet file.
         * 4. Activate the plugin using $(my-anchor-selector).snippety(); Example: $(".snippet").snippety();
         *
         * Options:
         * 1. showSourceCode
         *    - false (default): inserts the snippet into your page.
         *    - true: inserts the snippet source code into your page (inside a "pre" tag).
		 * 2. callback
		 *    - function reference: use to run any code after snippety returns succesfully
         */
    'use strict';
    $.fn.snippety = function (options) {
            
            var settings = $.extend({
                // These are the defaults.
                showSourceCode: false,
				callback: function () {}
            }, options );
            
            
            this.each(function () {
                
                // Snippet file URL
                var fileURL = $(this).attr("href");
                // Element that will be replaced by the snippet (i.e, the link);
                var placeholder = $(this);
                
                $.get(fileURL, function (data) {
                    
                    // Gets code snippet inside the file.
                    var snippet = $(data).filter("[data-pic-doc='snippet']").get(0);
                    var snippetSourceCode;
                    
                    // Clean up this control attribute.
                    snippet.removeAttribute("data-pic-doc");
                    
                    // If user want to show snippet source code.
                    if (settings.showSourceCode) {
                        
                        // Replace placeholder by an empty "pre" tag.
                        placeholder = $("<pre class='snippety-source'></pre>").replaceAll(placeholder);
                        // Put source code into the "pre" tag.
                        placeholder.text( $(snippet).wrap("<div/>").parent().html() );
                    }
                    // If user want to append snippet.
                    else {
                        // Replace placeholder element (the link) by the snippet.
                        placeholder.replaceWith(snippet);
                    }
					settings.callback();
                })
                .fail(function () {
                    console.warn("There was a problem openning file \"" + fileURL + "\". Please, check the used reference.");
                    placeholder.replaceWith("");
                });
                
            });
            
            return this;
        };
        
}) (jQuery);

})();
/* Início de novo arquivo concatenado */
(function () {/* CSS Animation */

var classe = "";
var intervalo;

$("[data-efect-start=true]").each(function () {
	clearInterval(intervalo);
	var $obj = $($(this).data("obj"));
	efeito = $(this).data("efect");

	if($obj.hasClass(efeito)){
		$obj.removeClass(efeito);
	}

	$obj.removeClass(classe).addClass($(this).data("efect"));
	$obj.addClass("block");
	classe = efeito;

	if($(this).data("clear")){
		intervalo = setTimeout(function(){
			$obj.removeClass(classe);
		},$(this).data("clear"));
	}
});

$(".btn-efect-start").click(function(){
	clearInterval(intervalo);
	var $obj = $($(this).data("obj"));
	efeito = $(this).data("efect");

	if($obj.hasClass(efeito)){
		$obj.removeClass(efeito);
	}

	$obj.removeClass(classe).addClass($(this).data("efect"));
	$obj.addClass("habilitar");
	classe = efeito;

	if($(this).data("clear")){
		intervalo = setTimeout(function(){
			$obj.removeClass(classe);
		},$(this).data("clear"));
	}
});
	
function iniciarAnimacao(obj, efect, timeEfect, efectDel, timeEfectDel){
	var $obj = $(obj);
	efeito = efect + " animated";
	efectDel = efectDel + " animated";
				
	var efectDelTimer;
	var loadEfectDel = function() {
		if(efectDel){
			$obj.removeClass(efectDel);
		}
	};		
	efectDelTimer = setTimeout(loadEfectDel, timeEfectDel);	
	
	var efectInitTimer;
	var loadEfect = function() {
		$obj.addClass(efeito);
	};			
	efectInitTimer = setTimeout(loadEfect, timeEfect);
}

})();
/* Início de novo arquivo concatenado */
(function () {$(document).ready(function() {
		if($.browser.msie){
			if($.browser.versionNumber != 8){
				hljs.initHighlighting();
			}
		}else{
			hljs.initHighlighting();
		}
	}
);



})();
/* Início de novo arquivo concatenado */
(function () {/* Custom Geral */
/* Insere carimbo relativo ao ambiente - Candidato a Plugin de Ambiente  */
var nomeAmbiente = $.trim($("body").attr("data-pic-ambiente"));
var carimboAmbienteTimer;

/* Retira os acentos de uma string */
function removeAccents(str) {
  var accents    = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
  var accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
  str = str.split('');
  var strLen = str.length;
  var i, x;
  for (i = 0; i < strLen; i++) {
    if ((x = accents.indexOf(str[i])) != -1) {
      str[i] = accentsOut[x];
    }
  }
  return str.join('');
}

/* Prepara o nome do ambiente para legibilidade */
function makeReadable(str) {
	var listaAmbientesValidos = ["desenvolvimento",
							 "homologacao",
							 "teste",
							 "prototipacao",
							 "prototipo"];
	
	if ($.inArray(nomeAmbienteNormalizado, listaAmbientesValidos) < 0) {
		return "NÃO RECONHECIDO";
	} else if(str === "homologacao") {
		return "homologação";
	} else if(str === "prototipacao") {
		return "prototipação";
	} else if(str === "prototipo") {
		return "protótipo";
	} else  {
		return str;
	}
}

// Tenta definir o item corrente (ativo) para o menu (global ou local)
// Se já houver um item corrente, não faz nada.
// Se não houver, procura por um link que aponte para a página atual, e define como corrente.
// Essa função deve ser usada apenas quando se trata de ambiente de prototipação.
// Nos demais ambientes, é responsabilidade do desenvolvedor manter esse controle.
// @param menu - Deve receber um dos valores: 'global' ou 'local'
function setCurrent(menu) {

    var attrName,
        objName,
        filename;
        
    menu = menu.toLowerCase();
        
    // Fará algo apenas se o parâmetro tiver um valor válido: 'global' ou 'local'
    if (menu !== 'global' && menu !== 'local') {
        return false;
    }
    
    // [data-pic-globalnav] ou [data-pic-localnav]
    attrName = '[data-pic-'+ menu +'nav]';
    // picGlobalnav ou picLocalnav
    objName  = 'pic' + menu.charAt(0).toUpperCase() + menu.substr(1) + 'nav';
    
    // Verifica se já tem algo marcado com corrente (ativo)
    if ($(attrName).find('li[data-pic-state-current]').length === 0) {
        // Encontra o nome do arquivo atual
        filename = window.location.pathname.split('/').pop();
        // Encontra o li que contém o link para o arquivo atual
        current = $(attrName).find('a[href$="'+ filename +'"]').parent('li');
        // Marca como item atual
        // -- Esse chamada é equivalente a (no caso de 'global' passado como parâmetro):
        // $([data-pic-globalnav]).picGlobalnav().setCurrent(current)
        return $(attrName)[objName]().setCurrent(current);
    }
}

var nomeAmbienteNormalizado = removeAccents(nomeAmbiente.toLowerCase());

if (nomeAmbienteNormalizado !== "producao") {
	//Marca o DOM para configuração do elemento de ambiente
	$("body").addClass("comSeloAmbiente");
    $("#cabecalho").append("<div class=\"seloAmbiente\">" + makeReadable(nomeAmbiente) + "</div>");

	if ($(".seloAmbiente").text()==="NÃO RECONHECIDO") {
		$(".seloAmbiente").addClass("invalido");
		$(".seloAmbienteLogin").addClass("invalido");
	}
	
	$("#cabecalho .seloAmbiente:not(.invalido)")
		.closest("body")
		.addClass("ambiente-" + nomeAmbienteNormalizado);

	//Aguarda um tempo antes de iniciar a animação da marca de ambiente
	$("#wrapper").css("overflow","hidden");
	window.setTimeout(function() {
			$(".seloAmbiente").addClass("posFinal");
			window.setTimeout(function() {
				$("#wrapper").css("overflow","");
			},1200);
	},600);
} else {
	$("body").addClass("ambiente-" + nomeAmbienteNormalizado);
}


/* Suporte para Prototipagem: inclusão de snnipets comuns as páginas */
/*    Funciona somente para o ambiente de prototipação */
//Inclusão dos menus local e global
if (["prototipacao","prototipo"].indexOf(nomeAmbienteNormalizado) >= 0) {
	var triggerElement = $("body[data-pic-snippets]");
	var snippetsList = $.isArray(triggerElement.data("picSnippets")) ? triggerElement.data("picSnippets") : [];

	if(snippetsList.length!==0) { // A página foi marcada - corretamente - para receber snippets

		//Obter snippets de menu local se a página estiver marcada para tanto
		if($.inArray("localnav",snippetsList) >= 0) {
			if($("[data-pic-localnav]").length === 0) {
				triggerElement.find("#banner")
							  .after("<a class=\"localnav-source\" href=\"snippet-menulocal.html\"></a>");
				triggerElement.find(".localnav-source")
							  .snippety(
								{callback:function() {
                                    
									$("#page-content-wrapper").removeClass("sidebar-off");
									PIC.activateWidget("Localnav");
                                    
                                    setCurrent('local');
                                    
								}}); 
			}
		}

		//Obter snippets de menu global se a página estiver marcada para tanto
		var base = $.grep(snippetsList, function(elemento){
			 if ($.isPlainObject(elemento)) {
				 return elemento.base;
			 }
		});
		base = base.length > 0 ? base.pop("base").base : "";
		if($.inArray("globalnav",snippetsList) >= 0) {
			if($("[data-pic-globalnav]").length === 0) {
				triggerElement.find("#banner #cabecalho")
							  .after("<a class=\"globalnav-source\" href=\"" + base + "/snippet-menuglobal.html\"></a>");
				triggerElement.find(".globalnav-source")
							  .snippety(
								{callback:function() {
                                    
									$("body").removeClass("semMenuSuperior");
									PIC.activateWidget("Globalnav");
                                    
                                    setCurrent('global');
                                    
								}}); 
			}
		}
	}
	var globalnav = $("header [data-pic-globalnav]");

	if(globalnav.length === 0) {
		$('body').addClass("semMenuSuperior"); //marca o body, por default, como página sem menu
	}	
}
// Verifica se existe sidebar e avisa (marca) a área de conteúdo principal
var sidebar = $('#pic-menu-local');
if(sidebar.length === 0){
    $('#page-content-wrapper').addClass("sidebar-off");
}


$(document).on('pic:themesReady', function() {
	//Botão do Menu de Suporte GLobal (ex-configurações) em telas pequenas


	$(".suporteGlobal").prepend("<a class=\"navbar-toggle button linkInfo\"" + 
								"data-toggle=\"collapse\" href=\".funcoesGlobais\">" +
								"<span class=\"sr-only\">Menu de Suporte Global </span>" +
								"<span class=\"glyphicon glyphicon-cog\" aria-hidden=\"true\"></span></a>");

	//Cria elemento .funcoesGlobais e botões para acionar os itens de lista
	$(".suporteGlobal>ul").addClass("funcoesGlobais collapse");

	/*
	* Todo .menuSuporte é menu dropdow - numa DIV com um A que é um trigger e as LIs são seus itens
	*/
	$(".suporteGlobal .menuSuporte").addClass("dropdown");
	$(".menuSuporte>a").addClass("dropdown-toggle")
					   .attr({'data-toggle': 'dropdown',
							  'aria-expanded':'false'});
	$(".menuSuporte>ul").addClass("dropdown-menu dropdown-menu-right")
						.attr("role","menu");

	//Configura id dos menus conhecidos do PIC e casa os ids com os labeledby
	$(".menuConfiguracoes>a").attr("id","dropdownMenuConfiguracoes");
	$(".menuNotificacoes>a").attr("id","dropdownMenuNotificacoes");
	$(".menuSuporte>ul").each( function() {
		$(this).attr("aria-labelledby", $(this).prev().attr("id"));
										});

	//Criar ícones pré-definidos nos elementos dos menus de suporte global
	$(".suporteGlobal .usuario").prepend("<span class=\"glyphicon glyphicon-user\" aria-hidden=\"true\"></span>");

	$(".suporteGlobal .menuConfiguracoes .dropdown-toggle").prepend("<span class=\"glyphicon glyphicon-cog\" aria-hidden=\"true\"></span>");

	//Elimina navegação por teclado dos itens de menus de suporte 
	$(".menuSuporte ul a").attr("tabindex","-1");

	// Bootstrap Hover Dropdown JS - Necessário para o funcionamento de dropdown 
	$('.dropdown-toggle').dropdownHover(); 

	/* 
	* Configurações para navegação por teclado para dropdown's usados
	* dentro da área de suporte global
	*/
	$(".suporteGlobal").on("keydown", ".dropdown-toggle", function(e){
		var keyCode = e.keyCode || e.which;
		switch(keyCode){
			case key.enter:
				$(this).click();
				$(this).next().attr("aria-hidden", "false");			
				$(this).next().children().first().children().focus();
				e.preventDefault();
				break;
		}
	});

	$(".suporteGlobal").on("keydown", ".dropdown-menu>li", function(e){
		var keyCode = e.keyCode || e.which;			
		switch(keyCode){
			case key.right:
			case key.down:
				if($(this).next().length !== 0){
					$(this).next().children().focus();
				}else{
					$(this).parent().children().first().children().focus();
				}
				e.preventDefault();
				break;
			case key.left:
			case key.up:
				$(this).prev().children().focus();
				e.preventDefault();
				break;
			case key.end:
				$(this).parent().children().last().children().focus();
				e.preventDefault();
				break;
			case key.home:
				$(this).parent().children().first().children().focus();
				e.preventDefault();
				break;          
			case key.tab:
				break;				
			}			
	});
});
	

// Adiciona classe table-serialized para tabelas com requisitos mínimos para serialização
$(".table").has("thead tr th")
		   .has("tbody tr td")
		   .each(function() {
				var linhasHead = $(this).find("thead tr");
				if (linhasHead.length !== 1) {
					return false;
				}
				var qtdColunas = linhasHead.children().length;
				var longLabels = false;
				for (i=1; i<=linhasHead.children().length; i++) {
					if (linhasHead.children(":nth-child("+i+")").text().length > 16) {
						longLabels = true;
						break;
					}
				}
				var linhasBody = $(this).find("tbody tr");
				for (i=0; i<linhasBody.length; i++) {
					if ($(linhasBody[i]).children().length !== qtdColunas) {
						return false;
					}
				}
				$(this).addClass("table-serialized");
				if (longLabels) {
					$(this).addClass("long-labels");
				}
		});
		   
/*
* Rotina para inserir data-title em td's para 
* tabelas serialized
* @TODO Resover problemas conhecidos:
*   - Se houver um 'th' como cabeçalho de linha, ocorre um deslocamento entre o cabeçalho e o valor
*     do 'data-title', já que a rotina considera a posição relativa olhando apenas para as 'td'.
*   - Qualquer tipo de colspan ou rowspan também resultará em problemas pelo mesmo motivo anterior,
*     já que o número de 'td's  seria diferente do número de 'th's.
*/
// Para cada tabela serializável
$('.table-serialized').each(function (tableIndex, table) {
    // Para cada cabeçalho (th)
    $(this).find('th').each(function (thIndex) {
        // Armazena o conteúdo (texto) da th
        var headingText = $(this).text();
        // Para cada linha (tr) da tabela
        $(table).find('tr').each(function (trIndex, tr) {
            // Para cada célula (td) da tabela cujo índice (posição relativa dentro da linha)
            // combine com o índice do cabeçalho (th) atual.
            // Define o atributo data-title com o valor do texto do cabeçalho.
            $(tr).children().eq(thIndex).attr('data-title', headingText)
        });
    });
});

/* Input Validate - candidata a reforçar a API do Validation.js */
highlightErrorField = function(id, msg){
    var $id = $(id);

    $id.attr("data-description", msg);
    $id.attr("tabindex", "0");
    $id.attr("data-validate", "notBlank");
    $id.attr("aria-invalid", "true");
    $id.attr("aria-describedby", id.replace("#", "")+"-feedbackMsg");
    $id.addClass("errorField");
    $id.parent().append("<span id=\""+id.replace("#", "")+"-feedbackMsg\" class=\"feedbackMsg error\" tabindex=\"-1\"><span style=\"font-family: FontAwesome; font-size: 16px;\" class=\"FontAwesome\" aria-hidden=\"true\"></span> Importante:" + msg +"</span>");
};

/*
* Fecha menu de suporte global de acordo com o click fora da área do menu em telas pequenas
*/
$(document).on('click', function (event) {
	var clickover = $(event.target),
		target,
		collapse = $(".funcoesGlobais").hasClass("in");	

		if (collapse === true && !$(".funcoesGlobais").find(clickover).length) {
			$(".linkInfo").click();
		}
});

/* Ativa todos os plugins do PIC */
PIC.activateWidget('Adaptableheader',  $("<div></div>").appendTo("body"), null, true);
PIC.activateWidget('Themes', $("<div></div>").appendTo("body"), null, true);
PIC.activateAllWidgets();


})();