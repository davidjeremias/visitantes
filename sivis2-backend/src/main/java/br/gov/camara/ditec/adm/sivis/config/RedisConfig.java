package br.gov.camara.ditec.adm.sivis.config;

//import org.springframework.data.redis.connection.RedisPassword;
//import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
//import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
//import org.springframework.data.redis.core.RedisTemplate;

//@Configuration
public class RedisConfig {

//	@Bean
//	JedisConnectionFactory jedisConnectionFactory() {
//	 
//		JedisConnectionFactory jedisConFactory = new JedisConnectionFactory();
//	    jedisConFactory.setHostName("localhost");
//	    jedisConFactory.setPort(6379);
//		return jedisConFactory;
//	    
//	    RedisStandaloneConfiguration redisStandaloneConfiguration = new RedisStandaloneConfiguration("http://gabinete-digital-redis", 6379);
//	    redisStandaloneConfiguration.setPassword(RedisPassword.of("123456789"));
//	    return new JedisConnectionFactory(redisStandaloneConfiguration);	    
//	}
	
	
	 
//	@Bean
//	public RedisTemplate<String, Object> redisTemplate() {
//	    
//		RedisTemplate<String, Object> template = new RedisTemplate<>();
//	    template.setConnectionFactory(jedisConnectionFactory());
//	    return template;
//	}
	
}
