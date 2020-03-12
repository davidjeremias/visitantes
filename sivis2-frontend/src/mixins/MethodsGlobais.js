const MethodsGlobal = {
    data() {
        return {
            isAlertModal: null,
            isCpf: '',
            isValid: '',
            isDuplicidade: ''
        }
    },
    methods: {
        verificaDataVencimentoDoc(dataEntrada) {
            /*Data corrente ou data atual*/
            var currentDate = moment().format("YYYY-MM-DD");
            var parteDataAt = currentDate.split("-");
            var dataAtual = new Date(parteDataAt[0], parteDataAt[1], parteDataAt[2]);

            /*Data de entrada*/
            var strData = dataEntrada;
            var partesData = strData.split("-");
            var dataDoc = new Date(partesData[0], partesData[1], partesData[2]);

            const year = moment(dataEntrada, "DD-MM-YYYY").year();

            if (year.toString() == 'NaN') {
                return false;

            } else {
                this.isErro = false;
                this.msgErro = "";

                if (dataAtual > dataDoc) {
                    return true;

                } else {
                    return false;
                }
            }

        },
        isAnteriorDate() {
            const currentDate = new Date();
            return currentDate.toISOString().substring(0, 10);
        },
    }
};

export default MethodsGlobal;