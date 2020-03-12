<template>
<div>
    <input type="date" ref="dataPick" :min="isAnteriorDate()" pattern="/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/" 
    class="form-control" 
    @blur="verificarData"
    />
    
    <div v-if="isErro" style="text-align:center;font-size:small;color:red;">
	    {{ msgErro }}
    </div>
</div>
</template>

<script>
export default {
    name: 'dataPick',
    props: {
        obrigatorio:Boolean,
        msgValidacao:String
        
    },
    data: () => ({
        date: '',
        msgErro: '',
        isErro: false,
        
    }),
    methods: {
        isAnteriorDate() {
            const currentDate = new Date();
            return currentDate.toISOString().substring(0, 10);
            
        },
        verificarData(){
            moment.locale('pt-BR');
            const currentDate = moment();
            const dataDigitada = moment(this.$refs.dataPick.value);
            const year = moment(dataDigitada,"YYYY-MM-DD").year();
            
           if(year.toString().length >4){
            this.$refs.dataPick.value = '';
            this.isErro = true;
            this.msgErro = "Entre com uma data válida.";
           }else if(dataDigitada == currentDate ||dataDigitada >= currentDate){
            this.isErro = false;
           }else{
            this.$refs.dataPick.value = '';
            this.isErro = true;
            this.msgErro = "A data não pode ser menor " + moment(currentDate).format("DD/MM/YYYY") +".";
               
           }
           
        },
        mounted(){
            alert('MOMENT');
            $('#dataPick').datetimepicker({
            format: 'MM/DD/YYYY',
             useCurrent: false,
            defaultDate: moment().subtract(7, 'days').format('MM/DD/YYYY')
});
        }
    }
};
</script>
