package br.gov.camara.ditec.adm.sivis.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.annotations.Api;

@RestController
@RequestMapping(value = "/upload")
@Api(value = "API REST Upload - Sivis-Backend")
public class FileController {
    
    @PostMapping("/uploadFile")
    public void uploadFile(@RequestParam("file") MultipartFile file) {
    }

    @PostMapping("/uploadMultipleFiles")
    public void uploadMultipleFiles(@RequestParam("files") MultipartFile[] files) {
    }

    @GetMapping("/downloadFile/{fileName:.+}")
    public void downloadFile(@PathVariable String fileName, HttpServletRequest request) {
    }
}