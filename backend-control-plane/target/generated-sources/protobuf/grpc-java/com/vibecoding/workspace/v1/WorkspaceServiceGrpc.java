package com.vibecoding.workspace.v1;

import static io.grpc.MethodDescriptor.generateFullMethodName;

/**
 * <pre>
 * 沙箱工作空间服务 (Go 数据面实现，Java 控制面调用)
 * </pre>
 */
@javax.annotation.Generated(
    value = "by gRPC proto compiler (version 1.62.2)",
    comments = "Source: vibe/workspace/v1/workspace.proto")
@io.grpc.stub.annotations.GrpcGenerated
public final class WorkspaceServiceGrpc {

  private WorkspaceServiceGrpc() {}

  public static final java.lang.String SERVICE_NAME = "vibe.workspace.v1.WorkspaceService";

  // Static method descriptors that strictly reflect the proto.
  private static volatile io.grpc.MethodDescriptor<com.vibecoding.workspace.v1.StartWorkspaceRequest,
      com.vibecoding.workspace.v1.StartWorkspaceResponse> getStartWorkspaceMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "StartWorkspace",
      requestType = com.vibecoding.workspace.v1.StartWorkspaceRequest.class,
      responseType = com.vibecoding.workspace.v1.StartWorkspaceResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<com.vibecoding.workspace.v1.StartWorkspaceRequest,
      com.vibecoding.workspace.v1.StartWorkspaceResponse> getStartWorkspaceMethod() {
    io.grpc.MethodDescriptor<com.vibecoding.workspace.v1.StartWorkspaceRequest, com.vibecoding.workspace.v1.StartWorkspaceResponse> getStartWorkspaceMethod;
    if ((getStartWorkspaceMethod = WorkspaceServiceGrpc.getStartWorkspaceMethod) == null) {
      synchronized (WorkspaceServiceGrpc.class) {
        if ((getStartWorkspaceMethod = WorkspaceServiceGrpc.getStartWorkspaceMethod) == null) {
          WorkspaceServiceGrpc.getStartWorkspaceMethod = getStartWorkspaceMethod =
              io.grpc.MethodDescriptor.<com.vibecoding.workspace.v1.StartWorkspaceRequest, com.vibecoding.workspace.v1.StartWorkspaceResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "StartWorkspace"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.vibecoding.workspace.v1.StartWorkspaceRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.vibecoding.workspace.v1.StartWorkspaceResponse.getDefaultInstance()))
              .setSchemaDescriptor(new WorkspaceServiceMethodDescriptorSupplier("StartWorkspace"))
              .build();
        }
      }
    }
    return getStartWorkspaceMethod;
  }

  private static volatile io.grpc.MethodDescriptor<com.vibecoding.workspace.v1.StopWorkspaceRequest,
      com.vibecoding.workspace.v1.StopWorkspaceResponse> getStopWorkspaceMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "StopWorkspace",
      requestType = com.vibecoding.workspace.v1.StopWorkspaceRequest.class,
      responseType = com.vibecoding.workspace.v1.StopWorkspaceResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<com.vibecoding.workspace.v1.StopWorkspaceRequest,
      com.vibecoding.workspace.v1.StopWorkspaceResponse> getStopWorkspaceMethod() {
    io.grpc.MethodDescriptor<com.vibecoding.workspace.v1.StopWorkspaceRequest, com.vibecoding.workspace.v1.StopWorkspaceResponse> getStopWorkspaceMethod;
    if ((getStopWorkspaceMethod = WorkspaceServiceGrpc.getStopWorkspaceMethod) == null) {
      synchronized (WorkspaceServiceGrpc.class) {
        if ((getStopWorkspaceMethod = WorkspaceServiceGrpc.getStopWorkspaceMethod) == null) {
          WorkspaceServiceGrpc.getStopWorkspaceMethod = getStopWorkspaceMethod =
              io.grpc.MethodDescriptor.<com.vibecoding.workspace.v1.StopWorkspaceRequest, com.vibecoding.workspace.v1.StopWorkspaceResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "StopWorkspace"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.vibecoding.workspace.v1.StopWorkspaceRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.vibecoding.workspace.v1.StopWorkspaceResponse.getDefaultInstance()))
              .setSchemaDescriptor(new WorkspaceServiceMethodDescriptorSupplier("StopWorkspace"))
              .build();
        }
      }
    }
    return getStopWorkspaceMethod;
  }

  private static volatile io.grpc.MethodDescriptor<com.vibecoding.workspace.v1.GetWorkspaceStatusRequest,
      com.vibecoding.workspace.v1.GetWorkspaceStatusResponse> getGetWorkspaceStatusMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "GetWorkspaceStatus",
      requestType = com.vibecoding.workspace.v1.GetWorkspaceStatusRequest.class,
      responseType = com.vibecoding.workspace.v1.GetWorkspaceStatusResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<com.vibecoding.workspace.v1.GetWorkspaceStatusRequest,
      com.vibecoding.workspace.v1.GetWorkspaceStatusResponse> getGetWorkspaceStatusMethod() {
    io.grpc.MethodDescriptor<com.vibecoding.workspace.v1.GetWorkspaceStatusRequest, com.vibecoding.workspace.v1.GetWorkspaceStatusResponse> getGetWorkspaceStatusMethod;
    if ((getGetWorkspaceStatusMethod = WorkspaceServiceGrpc.getGetWorkspaceStatusMethod) == null) {
      synchronized (WorkspaceServiceGrpc.class) {
        if ((getGetWorkspaceStatusMethod = WorkspaceServiceGrpc.getGetWorkspaceStatusMethod) == null) {
          WorkspaceServiceGrpc.getGetWorkspaceStatusMethod = getGetWorkspaceStatusMethod =
              io.grpc.MethodDescriptor.<com.vibecoding.workspace.v1.GetWorkspaceStatusRequest, com.vibecoding.workspace.v1.GetWorkspaceStatusResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "GetWorkspaceStatus"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.vibecoding.workspace.v1.GetWorkspaceStatusRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.vibecoding.workspace.v1.GetWorkspaceStatusResponse.getDefaultInstance()))
              .setSchemaDescriptor(new WorkspaceServiceMethodDescriptorSupplier("GetWorkspaceStatus"))
              .build();
        }
      }
    }
    return getGetWorkspaceStatusMethod;
  }

  private static volatile io.grpc.MethodDescriptor<com.vibecoding.workspace.v1.DestroyWorkspaceRequest,
      com.vibecoding.workspace.v1.DestroyWorkspaceResponse> getDestroyWorkspaceMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "DestroyWorkspace",
      requestType = com.vibecoding.workspace.v1.DestroyWorkspaceRequest.class,
      responseType = com.vibecoding.workspace.v1.DestroyWorkspaceResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<com.vibecoding.workspace.v1.DestroyWorkspaceRequest,
      com.vibecoding.workspace.v1.DestroyWorkspaceResponse> getDestroyWorkspaceMethod() {
    io.grpc.MethodDescriptor<com.vibecoding.workspace.v1.DestroyWorkspaceRequest, com.vibecoding.workspace.v1.DestroyWorkspaceResponse> getDestroyWorkspaceMethod;
    if ((getDestroyWorkspaceMethod = WorkspaceServiceGrpc.getDestroyWorkspaceMethod) == null) {
      synchronized (WorkspaceServiceGrpc.class) {
        if ((getDestroyWorkspaceMethod = WorkspaceServiceGrpc.getDestroyWorkspaceMethod) == null) {
          WorkspaceServiceGrpc.getDestroyWorkspaceMethod = getDestroyWorkspaceMethod =
              io.grpc.MethodDescriptor.<com.vibecoding.workspace.v1.DestroyWorkspaceRequest, com.vibecoding.workspace.v1.DestroyWorkspaceResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "DestroyWorkspace"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.vibecoding.workspace.v1.DestroyWorkspaceRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.vibecoding.workspace.v1.DestroyWorkspaceResponse.getDefaultInstance()))
              .setSchemaDescriptor(new WorkspaceServiceMethodDescriptorSupplier("DestroyWorkspace"))
              .build();
        }
      }
    }
    return getDestroyWorkspaceMethod;
  }

  /**
   * Creates a new async stub that supports all call types for the service
   */
  public static WorkspaceServiceStub newStub(io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<WorkspaceServiceStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<WorkspaceServiceStub>() {
        @java.lang.Override
        public WorkspaceServiceStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new WorkspaceServiceStub(channel, callOptions);
        }
      };
    return WorkspaceServiceStub.newStub(factory, channel);
  }

  /**
   * Creates a new blocking-style stub that supports unary and streaming output calls on the service
   */
  public static WorkspaceServiceBlockingStub newBlockingStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<WorkspaceServiceBlockingStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<WorkspaceServiceBlockingStub>() {
        @java.lang.Override
        public WorkspaceServiceBlockingStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new WorkspaceServiceBlockingStub(channel, callOptions);
        }
      };
    return WorkspaceServiceBlockingStub.newStub(factory, channel);
  }

  /**
   * Creates a new ListenableFuture-style stub that supports unary calls on the service
   */
  public static WorkspaceServiceFutureStub newFutureStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<WorkspaceServiceFutureStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<WorkspaceServiceFutureStub>() {
        @java.lang.Override
        public WorkspaceServiceFutureStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new WorkspaceServiceFutureStub(channel, callOptions);
        }
      };
    return WorkspaceServiceFutureStub.newStub(factory, channel);
  }

  /**
   * <pre>
   * 沙箱工作空间服务 (Go 数据面实现，Java 控制面调用)
   * </pre>
   */
  public interface AsyncService {

    /**
     * <pre>
     * 创建并启动一个新的学生沙箱容器
     * </pre>
     */
    default void startWorkspace(com.vibecoding.workspace.v1.StartWorkspaceRequest request,
        io.grpc.stub.StreamObserver<com.vibecoding.workspace.v1.StartWorkspaceResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getStartWorkspaceMethod(), responseObserver);
    }

    /**
     * <pre>
     * 暂停/停止沙箱运行
     * </pre>
     */
    default void stopWorkspace(com.vibecoding.workspace.v1.StopWorkspaceRequest request,
        io.grpc.stub.StreamObserver<com.vibecoding.workspace.v1.StopWorkspaceResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getStopWorkspaceMethod(), responseObserver);
    }

    /**
     * <pre>
     * 获取沙箱当前状态与终端连接信息
     * </pre>
     */
    default void getWorkspaceStatus(com.vibecoding.workspace.v1.GetWorkspaceStatusRequest request,
        io.grpc.stub.StreamObserver<com.vibecoding.workspace.v1.GetWorkspaceStatusResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getGetWorkspaceStatusMethod(), responseObserver);
    }

    /**
     * <pre>
     * 彻底销毁沙箱并回收所有资源
     * </pre>
     */
    default void destroyWorkspace(com.vibecoding.workspace.v1.DestroyWorkspaceRequest request,
        io.grpc.stub.StreamObserver<com.vibecoding.workspace.v1.DestroyWorkspaceResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getDestroyWorkspaceMethod(), responseObserver);
    }
  }

  /**
   * Base class for the server implementation of the service WorkspaceService.
   * <pre>
   * 沙箱工作空间服务 (Go 数据面实现，Java 控制面调用)
   * </pre>
   */
  public static abstract class WorkspaceServiceImplBase
      implements io.grpc.BindableService, AsyncService {

    @java.lang.Override public final io.grpc.ServerServiceDefinition bindService() {
      return WorkspaceServiceGrpc.bindService(this);
    }
  }

  /**
   * A stub to allow clients to do asynchronous rpc calls to service WorkspaceService.
   * <pre>
   * 沙箱工作空间服务 (Go 数据面实现，Java 控制面调用)
   * </pre>
   */
  public static final class WorkspaceServiceStub
      extends io.grpc.stub.AbstractAsyncStub<WorkspaceServiceStub> {
    private WorkspaceServiceStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected WorkspaceServiceStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new WorkspaceServiceStub(channel, callOptions);
    }

    /**
     * <pre>
     * 创建并启动一个新的学生沙箱容器
     * </pre>
     */
    public void startWorkspace(com.vibecoding.workspace.v1.StartWorkspaceRequest request,
        io.grpc.stub.StreamObserver<com.vibecoding.workspace.v1.StartWorkspaceResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getStartWorkspaceMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * 暂停/停止沙箱运行
     * </pre>
     */
    public void stopWorkspace(com.vibecoding.workspace.v1.StopWorkspaceRequest request,
        io.grpc.stub.StreamObserver<com.vibecoding.workspace.v1.StopWorkspaceResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getStopWorkspaceMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * 获取沙箱当前状态与终端连接信息
     * </pre>
     */
    public void getWorkspaceStatus(com.vibecoding.workspace.v1.GetWorkspaceStatusRequest request,
        io.grpc.stub.StreamObserver<com.vibecoding.workspace.v1.GetWorkspaceStatusResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getGetWorkspaceStatusMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     * <pre>
     * 彻底销毁沙箱并回收所有资源
     * </pre>
     */
    public void destroyWorkspace(com.vibecoding.workspace.v1.DestroyWorkspaceRequest request,
        io.grpc.stub.StreamObserver<com.vibecoding.workspace.v1.DestroyWorkspaceResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getDestroyWorkspaceMethod(), getCallOptions()), request, responseObserver);
    }
  }

  /**
   * A stub to allow clients to do synchronous rpc calls to service WorkspaceService.
   * <pre>
   * 沙箱工作空间服务 (Go 数据面实现，Java 控制面调用)
   * </pre>
   */
  public static final class WorkspaceServiceBlockingStub
      extends io.grpc.stub.AbstractBlockingStub<WorkspaceServiceBlockingStub> {
    private WorkspaceServiceBlockingStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected WorkspaceServiceBlockingStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new WorkspaceServiceBlockingStub(channel, callOptions);
    }

    /**
     * <pre>
     * 创建并启动一个新的学生沙箱容器
     * </pre>
     */
    public com.vibecoding.workspace.v1.StartWorkspaceResponse startWorkspace(com.vibecoding.workspace.v1.StartWorkspaceRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getStartWorkspaceMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * 暂停/停止沙箱运行
     * </pre>
     */
    public com.vibecoding.workspace.v1.StopWorkspaceResponse stopWorkspace(com.vibecoding.workspace.v1.StopWorkspaceRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getStopWorkspaceMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * 获取沙箱当前状态与终端连接信息
     * </pre>
     */
    public com.vibecoding.workspace.v1.GetWorkspaceStatusResponse getWorkspaceStatus(com.vibecoding.workspace.v1.GetWorkspaceStatusRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getGetWorkspaceStatusMethod(), getCallOptions(), request);
    }

    /**
     * <pre>
     * 彻底销毁沙箱并回收所有资源
     * </pre>
     */
    public com.vibecoding.workspace.v1.DestroyWorkspaceResponse destroyWorkspace(com.vibecoding.workspace.v1.DestroyWorkspaceRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getDestroyWorkspaceMethod(), getCallOptions(), request);
    }
  }

  /**
   * A stub to allow clients to do ListenableFuture-style rpc calls to service WorkspaceService.
   * <pre>
   * 沙箱工作空间服务 (Go 数据面实现，Java 控制面调用)
   * </pre>
   */
  public static final class WorkspaceServiceFutureStub
      extends io.grpc.stub.AbstractFutureStub<WorkspaceServiceFutureStub> {
    private WorkspaceServiceFutureStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected WorkspaceServiceFutureStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new WorkspaceServiceFutureStub(channel, callOptions);
    }

    /**
     * <pre>
     * 创建并启动一个新的学生沙箱容器
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<com.vibecoding.workspace.v1.StartWorkspaceResponse> startWorkspace(
        com.vibecoding.workspace.v1.StartWorkspaceRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getStartWorkspaceMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * 暂停/停止沙箱运行
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<com.vibecoding.workspace.v1.StopWorkspaceResponse> stopWorkspace(
        com.vibecoding.workspace.v1.StopWorkspaceRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getStopWorkspaceMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * 获取沙箱当前状态与终端连接信息
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<com.vibecoding.workspace.v1.GetWorkspaceStatusResponse> getWorkspaceStatus(
        com.vibecoding.workspace.v1.GetWorkspaceStatusRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getGetWorkspaceStatusMethod(), getCallOptions()), request);
    }

    /**
     * <pre>
     * 彻底销毁沙箱并回收所有资源
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<com.vibecoding.workspace.v1.DestroyWorkspaceResponse> destroyWorkspace(
        com.vibecoding.workspace.v1.DestroyWorkspaceRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getDestroyWorkspaceMethod(), getCallOptions()), request);
    }
  }

  private static final int METHODID_START_WORKSPACE = 0;
  private static final int METHODID_STOP_WORKSPACE = 1;
  private static final int METHODID_GET_WORKSPACE_STATUS = 2;
  private static final int METHODID_DESTROY_WORKSPACE = 3;

  private static final class MethodHandlers<Req, Resp> implements
      io.grpc.stub.ServerCalls.UnaryMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ServerStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ClientStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.BidiStreamingMethod<Req, Resp> {
    private final AsyncService serviceImpl;
    private final int methodId;

    MethodHandlers(AsyncService serviceImpl, int methodId) {
      this.serviceImpl = serviceImpl;
      this.methodId = methodId;
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public void invoke(Req request, io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        case METHODID_START_WORKSPACE:
          serviceImpl.startWorkspace((com.vibecoding.workspace.v1.StartWorkspaceRequest) request,
              (io.grpc.stub.StreamObserver<com.vibecoding.workspace.v1.StartWorkspaceResponse>) responseObserver);
          break;
        case METHODID_STOP_WORKSPACE:
          serviceImpl.stopWorkspace((com.vibecoding.workspace.v1.StopWorkspaceRequest) request,
              (io.grpc.stub.StreamObserver<com.vibecoding.workspace.v1.StopWorkspaceResponse>) responseObserver);
          break;
        case METHODID_GET_WORKSPACE_STATUS:
          serviceImpl.getWorkspaceStatus((com.vibecoding.workspace.v1.GetWorkspaceStatusRequest) request,
              (io.grpc.stub.StreamObserver<com.vibecoding.workspace.v1.GetWorkspaceStatusResponse>) responseObserver);
          break;
        case METHODID_DESTROY_WORKSPACE:
          serviceImpl.destroyWorkspace((com.vibecoding.workspace.v1.DestroyWorkspaceRequest) request,
              (io.grpc.stub.StreamObserver<com.vibecoding.workspace.v1.DestroyWorkspaceResponse>) responseObserver);
          break;
        default:
          throw new AssertionError();
      }
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public io.grpc.stub.StreamObserver<Req> invoke(
        io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        default:
          throw new AssertionError();
      }
    }
  }

  public static final io.grpc.ServerServiceDefinition bindService(AsyncService service) {
    return io.grpc.ServerServiceDefinition.builder(getServiceDescriptor())
        .addMethod(
          getStartWorkspaceMethod(),
          io.grpc.stub.ServerCalls.asyncUnaryCall(
            new MethodHandlers<
              com.vibecoding.workspace.v1.StartWorkspaceRequest,
              com.vibecoding.workspace.v1.StartWorkspaceResponse>(
                service, METHODID_START_WORKSPACE)))
        .addMethod(
          getStopWorkspaceMethod(),
          io.grpc.stub.ServerCalls.asyncUnaryCall(
            new MethodHandlers<
              com.vibecoding.workspace.v1.StopWorkspaceRequest,
              com.vibecoding.workspace.v1.StopWorkspaceResponse>(
                service, METHODID_STOP_WORKSPACE)))
        .addMethod(
          getGetWorkspaceStatusMethod(),
          io.grpc.stub.ServerCalls.asyncUnaryCall(
            new MethodHandlers<
              com.vibecoding.workspace.v1.GetWorkspaceStatusRequest,
              com.vibecoding.workspace.v1.GetWorkspaceStatusResponse>(
                service, METHODID_GET_WORKSPACE_STATUS)))
        .addMethod(
          getDestroyWorkspaceMethod(),
          io.grpc.stub.ServerCalls.asyncUnaryCall(
            new MethodHandlers<
              com.vibecoding.workspace.v1.DestroyWorkspaceRequest,
              com.vibecoding.workspace.v1.DestroyWorkspaceResponse>(
                service, METHODID_DESTROY_WORKSPACE)))
        .build();
  }

  private static abstract class WorkspaceServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoFileDescriptorSupplier, io.grpc.protobuf.ProtoServiceDescriptorSupplier {
    WorkspaceServiceBaseDescriptorSupplier() {}

    @java.lang.Override
    public com.google.protobuf.Descriptors.FileDescriptor getFileDescriptor() {
      return com.vibecoding.workspace.v1.WorkspaceProto.getDescriptor();
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.ServiceDescriptor getServiceDescriptor() {
      return getFileDescriptor().findServiceByName("WorkspaceService");
    }
  }

  private static final class WorkspaceServiceFileDescriptorSupplier
      extends WorkspaceServiceBaseDescriptorSupplier {
    WorkspaceServiceFileDescriptorSupplier() {}
  }

  private static final class WorkspaceServiceMethodDescriptorSupplier
      extends WorkspaceServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoMethodDescriptorSupplier {
    private final java.lang.String methodName;

    WorkspaceServiceMethodDescriptorSupplier(java.lang.String methodName) {
      this.methodName = methodName;
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.MethodDescriptor getMethodDescriptor() {
      return getServiceDescriptor().findMethodByName(methodName);
    }
  }

  private static volatile io.grpc.ServiceDescriptor serviceDescriptor;

  public static io.grpc.ServiceDescriptor getServiceDescriptor() {
    io.grpc.ServiceDescriptor result = serviceDescriptor;
    if (result == null) {
      synchronized (WorkspaceServiceGrpc.class) {
        result = serviceDescriptor;
        if (result == null) {
          serviceDescriptor = result = io.grpc.ServiceDescriptor.newBuilder(SERVICE_NAME)
              .setSchemaDescriptor(new WorkspaceServiceFileDescriptorSupplier())
              .addMethod(getStartWorkspaceMethod())
              .addMethod(getStopWorkspaceMethod())
              .addMethod(getGetWorkspaceStatusMethod())
              .addMethod(getDestroyWorkspaceMethod())
              .build();
        }
      }
    }
    return result;
  }
}
