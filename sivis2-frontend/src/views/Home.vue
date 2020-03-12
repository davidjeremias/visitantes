<template>
<div>
    <Datatable />
    <Modal />
</div>
</template>

<script>
import Datatable from '../components/Datatable.vue';
import Modal from '../views/Modal.vue';


export default {
  name: 'Home',
  components: {
    Datatable,
	Modal
  }
};
</script>
